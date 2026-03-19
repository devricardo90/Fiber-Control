import type { Prisma, CustomerStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type PaymentWithCustomer = Prisma.PaymentGetPayload<{
  include: {
    customer: true;
  };
}>;

export type CreatePaymentRepositoryInput = {
  customerId: string;
  referenceMonth: string;
  expectedAmount: number;
  receivedAmount: number;
  status: "PENDING" | "PARTIAL" | "PAID";
  paidAt?: Date | undefined;
  notes?: string | undefined;
};

export class PaymentsRepository {
  async findCustomerById(customerId: string) {
    return prisma.customer.findUnique({
      where: {
        id: customerId
      },
      include: {
        payments: true
      }
    });
  }

  async create(input: CreatePaymentRepositoryInput): Promise<PaymentWithCustomer> {
    const payment = await prisma.payment.create({
      data: toPaymentCreateData(input)
    });

    return prisma.payment.findUniqueOrThrow({
      where: {
        id: payment.id
      },
      include: {
        customer: true
      }
    });
  }

  async updateCustomerStatus(customerId: string, status: CustomerStatus): Promise<void> {
    await prisma.customer.update({
      where: {
        id: customerId
      },
      data: {
        status
      }
    });
  }

  async findMany(): Promise<PaymentWithCustomer[]> {
    return prisma.payment.findMany({
      include: {
        customer: true
      },
      orderBy: [
        {
          referenceMonth: "desc"
        },
        {
          createdAt: "desc"
        }
      ]
    });
  }

  async findById(paymentId: string): Promise<PaymentWithCustomer | null> {
    return prisma.payment.findUnique({
      where: {
        id: paymentId
      },
      include: {
        customer: true
      }
    });
  }

  async updatePaymentAmounts(
    paymentId: string,
    input: {
      receivedAmount: number;
      status: "PENDING" | "PARTIAL" | "PAID";
      paidAt: Date | null;
    }
  ): Promise<PaymentWithCustomer> {
    await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        receivedAmount: input.receivedAmount,
        status: input.status,
        paidAt: input.paidAt
      }
    });

    return prisma.payment.findUniqueOrThrow({
      where: {
        id: paymentId
      },
      include: {
        customer: true
      }
    });
  }
}

function toPaymentCreateData(input: CreatePaymentRepositoryInput): Prisma.PaymentUncheckedCreateInput {
  const data: Prisma.PaymentUncheckedCreateInput = {
    customerId: input.customerId,
    referenceMonth: input.referenceMonth,
    expectedAmount: input.expectedAmount,
    receivedAmount: input.receivedAmount,
    status: input.status
  };

  if (input.paidAt !== undefined) data.paidAt = input.paidAt;
  if (input.notes !== undefined) data.notes = input.notes;

  return data;
}
