import type { CustomerStatus, Payment, Prisma, Region } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type CustomerWithRegion = Prisma.CustomerGetPayload<{
  include: {
    region: true;
  };
}>;

type CustomerWithPayments = Prisma.CustomerGetPayload<{
  include: {
    payments: true;
  };
}>;

export type CreateCustomerRepositoryInput = {
  fullName: string;
  documentId?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  addressLine?: string | undefined;
  addressNumber?: string | undefined;
  neighborhood?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  postalCode?: string | undefined;
  notes?: string | undefined;
  monthlyFee: number;
  dueDay: number;
  graceDays: number;
  cutoffDays: number;
  serviceStartDate?: Date | undefined;
  regionId?: string | undefined;
};

export type UpdateCustomerRepositoryInput = {
  fullName?: string | undefined;
  documentId?: string | undefined;
  phone?: string | undefined;
  addressLine?: string | undefined;
  addressNumber?: string | undefined;
  neighborhood?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  postalCode?: string | undefined;
  monthlyFee?: number | undefined;
  dueDay?: number | undefined;
  graceDays?: number | undefined;
  cutoffDays?: number | undefined;
  regionId?: string | undefined;
};

export class CustomersRepository {
  async create(input: CreateCustomerRepositoryInput): Promise<CustomerWithRegion> {
    const customer = await prisma.customer.create({
      data: toCustomerCreateData(input)
    });

    return prisma.customer.findUniqueOrThrow({
      where: {
        id: customer.id
      },
      include: {
        region: true
      }
    });
  }

  async findMany(): Promise<CustomerWithRegion[]> {
    return prisma.customer.findMany({
      include: {
        region: true
      },
      orderBy: {
        fullName: "asc"
      }
    });
  }

  async findById(customerId: string): Promise<CustomerWithRegion | null> {
    return prisma.customer.findUnique({
      where: {
        id: customerId
      },
      include: {
        region: true,
        payments: {
          orderBy: {
            referenceMonth: "desc"
          }
        }
      }
    }) as Promise<(CustomerWithRegion & { payments: Payment[] }) | null>;
  }

  async update(customerId: string, input: UpdateCustomerRepositoryInput): Promise<CustomerWithRegion> {
    await prisma.customer.update({
      where: {
        id: customerId
      },
      data: toCustomerUpdateData(input)
    });

    return prisma.customer.findUniqueOrThrow({
      where: {
        id: customerId
      },
      include: {
        region: true
      }
    });
  }

  async findRegionById(regionId: string): Promise<Region | null> {
    return prisma.region.findUnique({
      where: {
        id: regionId
      }
    });
  }

  async findByIdWithPayments(customerId: string): Promise<CustomerWithPayments | null> {
    return prisma.customer.findUnique({
      where: {
        id: customerId
      },
      include: {
        payments: true
      }
    });
  }

  async updateStatus(customerId: string, status: CustomerStatus): Promise<CustomerWithRegion> {
    await prisma.customer.update({
      where: {
        id: customerId
      },
      data: {
        status
      }
    });

    return prisma.customer.findUniqueOrThrow({
      where: {
        id: customerId
      },
      include: {
        region: true
      }
    });
  }
}

function toCustomerCreateData(input: CreateCustomerRepositoryInput): Prisma.CustomerUncheckedCreateInput {
  const data: Prisma.CustomerUncheckedCreateInput = {
    fullName: input.fullName,
    monthlyFee: input.monthlyFee,
    dueDay: input.dueDay,
    graceDays: input.graceDays,
    cutoffDays: input.cutoffDays
  };

  if (input.documentId !== undefined) data.documentId = input.documentId;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.email !== undefined) data.email = input.email;
  if (input.addressLine !== undefined) data.addressLine = input.addressLine;
  if (input.addressNumber !== undefined) data.addressNumber = input.addressNumber;
  if (input.neighborhood !== undefined) data.neighborhood = input.neighborhood;
  if (input.city !== undefined) data.city = input.city;
  if (input.state !== undefined) data.state = input.state;
  if (input.postalCode !== undefined) data.postalCode = input.postalCode;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.serviceStartDate !== undefined) data.serviceStartDate = input.serviceStartDate;
  if (input.regionId !== undefined) data.regionId = input.regionId;

  return data;
}

function toCustomerUpdateData(input: UpdateCustomerRepositoryInput): Prisma.CustomerUncheckedUpdateInput {
  const data: Prisma.CustomerUncheckedUpdateInput = {};

  if (input.fullName !== undefined) data.fullName = input.fullName;
  if (input.documentId !== undefined) data.documentId = input.documentId;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.addressLine !== undefined) data.addressLine = input.addressLine;
  if (input.addressNumber !== undefined) data.addressNumber = input.addressNumber;
  if (input.neighborhood !== undefined) data.neighborhood = input.neighborhood;
  if (input.city !== undefined) data.city = input.city;
  if (input.state !== undefined) data.state = input.state;
  if (input.postalCode !== undefined) data.postalCode = input.postalCode;
  if (input.monthlyFee !== undefined) data.monthlyFee = input.monthlyFee;
  if (input.dueDay !== undefined) data.dueDay = input.dueDay;
  if (input.graceDays !== undefined) data.graceDays = input.graceDays;
  if (input.cutoffDays !== undefined) data.cutoffDays = input.cutoffDays;
  if (input.regionId !== undefined) data.regionId = input.regionId;

  return data;
}
