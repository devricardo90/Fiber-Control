import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../lib/app-error.js";
import { CustomerStatusService } from "./customer-status.service.js";
import type {
  CustomersRepository,
  CreateCustomerRepositoryInput,
  UpdateCustomerRepositoryInput
} from "./customers.repository.js";

type CreateCustomerInput = CreateCustomerRepositoryInput;
type UpdateCustomerInput = UpdateCustomerRepositoryInput;

type CustomerRecord = Awaited<ReturnType<CustomersRepository["create"]>> & {
  payments?: any[];
};

export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly customerStatusService = new CustomerStatusService()
  ) {}

  async createCustomer(input: CreateCustomerInput) {
    if (input.regionId) {
      const region = await this.customersRepository.findRegionById(input.regionId);

      if (!region) {
        throw new AppError(404, "REGION_NOT_FOUND", "Region was not found");
      }
    }

    try {
      const customer = await this.customersRepository.create(input);

      return mapCustomer(customer);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "CUSTOMER_ALREADY_EXISTS", "Customer already exists");
      }

      throw error;
    }
  }

  async listCustomers() {
    const customers = await this.customersRepository.findMany();

    return customers.map(mapCustomer);
  }

  async getCustomerById(customerId: string) {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    return mapCustomer(customer);
  }

  async updateCustomer(customerId: string, input: UpdateCustomerInput) {
    if (Object.keys(input).length === 0) {
      throw new AppError(400, "EMPTY_UPDATE_PAYLOAD", "Update payload cannot be empty");
    }

    const existingCustomer = await this.customersRepository.findById(customerId);

    if (!existingCustomer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    if (input.regionId) {
      const region = await this.customersRepository.findRegionById(input.regionId);

      if (!region) {
        throw new AppError(404, "REGION_NOT_FOUND", "Region was not found");
      }
    }

    const effectiveGraceDays = input.graceDays ?? existingCustomer.graceDays;
    const effectiveCutoffDays = input.cutoffDays ?? existingCustomer.cutoffDays;

    if (effectiveCutoffDays < effectiveGraceDays) {
      throw new AppError(
        400,
        "INVALID_CUTOFF_DAYS",
        "Cutoff days cannot be less than grace days"
      );
    }

    try {
      const customer = await this.customersRepository.update(customerId, input);

      return mapCustomer(customer);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "CUSTOMER_ALREADY_EXISTS", "Customer already exists");
      }

      throw error;
    }
  }

  async recalculateCustomerStatus(customerId: string, referenceDate?: string) {
    const customer = await this.customersRepository.findByIdWithPayments(customerId) as any;

    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    const recalculatedStatus = this.customerStatusService.recalculateStatus(
      customer,
      parseReferenceDate(referenceDate)
    );
    const updatedCustomer = await this.customersRepository.updateStatus(customerId, recalculatedStatus);

    return mapCustomer(updatedCustomer);
  }
}

function mapCustomer(customer: CustomerRecord) {
  return {
    id: customer.id,
    fullName: customer.fullName,
    documentId: customer.documentId,
    phone: customer.phone,
    email: customer.email,
    addressLine: customer.addressLine,
    addressNumber: customer.addressNumber,
    neighborhood: customer.neighborhood,
    city: customer.city,
    state: customer.state,
    postalCode: customer.postalCode,
    notes: customer.notes,
    status: mapCustomerStatus(customer.status),
    monthlyFee: Number(customer.monthlyFee),
    dueDay: customer.dueDay,
    graceDays: customer.graceDays,
    cutoffDays: customer.cutoffDays,
    serviceStartDate: customer.serviceStartDate?.toISOString().slice(0, 10) ?? null,
    regionId: customer.regionId,
    region: customer.region
      ? {
          id: customer.region.id,
          name: customer.region.name,
          code: customer.region.code,
          description: customer.region.description
        }
      : null,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
    payments: customer.payments ? customer.payments.map((p: any) => ({
      id: p.id,
      referenceMonth: p.referenceMonth,
      expectedAmount: Number(p.expectedAmount),
      receivedAmount: Number(p.receivedAmount),
      status: p.status.toLowerCase(),
      paidAt: p.paidAt?.toISOString() ?? null,
      notes: p.notes
    })) : []
  };
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

function parseReferenceDate(referenceDate?: string) {
  if (!referenceDate) {
    return new Date();
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) {
    throw new AppError(400, "INVALID_REFERENCE_DATE", "Reference date must use YYYY-MM-DD");
  }

  const parsedDate = new Date(`${referenceDate}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, "INVALID_REFERENCE_DATE", "Reference date must use YYYY-MM-DD");
  }

  return parsedDate;
}
