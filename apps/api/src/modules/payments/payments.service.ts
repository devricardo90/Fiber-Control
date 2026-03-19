import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../lib/app-error.js";
import { CustomerStatusService } from "../customers/customer-status.service.js";
import type { PaymentsRepository, CreatePaymentRepositoryInput } from "./payments.repository.js";

type PaymentRecord = Awaited<ReturnType<PaymentsRepository["create"]>>;

type CreatePaymentInput = {
  customerId: string;
  referenceMonth: string;
  receivedAmount: number;
  paidAt?: Date | undefined;
  notes?: string | undefined;
};

export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly customerStatusService = new CustomerStatusService()
  ) {}

  async createPayment(input: CreatePaymentInput) {
    if (!isReferenceMonthValid(input.referenceMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const customer = await this.paymentsRepository.findCustomerById(input.customerId);

    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    const expectedAmount = Number(customer.monthlyFee);
    const status = derivePaymentStatus(input.receivedAmount, expectedAmount);
    const paymentInput: CreatePaymentRepositoryInput = {
      customerId: input.customerId,
      referenceMonth: input.referenceMonth,
      expectedAmount,
      receivedAmount: input.receivedAmount,
      status,
      paidAt: status === "PENDING" ? undefined : input.paidAt ?? new Date(),
      notes: input.notes
    };

    try {
      const payment = await this.paymentsRepository.create(paymentInput);

      const customerWithPayments = await this.paymentsRepository.findCustomerById(input.customerId);

      if (!customerWithPayments) {
        throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
      }

      const recalculatedStatus = this.customerStatusService.recalculateStatus(customerWithPayments);
      await this.paymentsRepository.updateCustomerStatus(input.customerId, recalculatedStatus);

      return mapPayment(payment);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          409,
          "PAYMENT_REFERENCE_ALREADY_EXISTS",
          "Payment for this customer and reference month already exists"
        );
      }

      throw error;
    }
  }

  async listPayments() {
    const payments = await this.paymentsRepository.findMany();

    return payments.map(mapPayment);
  }
}

function derivePaymentStatus(receivedAmount: number, expectedAmount: number) {
  if (receivedAmount === 0) {
    return "PENDING" as const;
  }

  if (receivedAmount < expectedAmount) {
    return "PARTIAL" as const;
  }

  return "PAID" as const;
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}

function mapPayment(payment: PaymentRecord) {
  return {
    id: payment.id,
    customerId: payment.customerId,
    referenceMonth: payment.referenceMonth,
    expectedAmount: Number(payment.expectedAmount),
    receivedAmount: Number(payment.receivedAmount),
    status: mapPaymentStatus(payment.status),
    paidAt: payment.paidAt?.toISOString() ?? null,
    notes: payment.notes,
    customer: {
      id: payment.customer.id,
      fullName: payment.customer.fullName,
      status: mapCustomerStatus(payment.customer.status)
    },
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString()
  };
}

function mapPaymentStatus(status: string) {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    PAID: "paid",
    PARTIAL: "partial",
    FAILED: "failed"
  };

  return statusMap[status] ?? status.toLowerCase();
}

function mapCustomerStatus(status: string) {
  const statusMap: Record<string, string> = {
    ACTIVE: "active",
    DUE_TODAY: "due_today",
    OVERDUE: "overdue",
    SUSPENDED: "suspended",
    INACTIVE: "inactive"
  };

  return statusMap[status] ?? status.toLowerCase();
}
