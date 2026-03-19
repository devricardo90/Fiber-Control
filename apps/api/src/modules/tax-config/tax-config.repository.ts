import { prisma } from "../../lib/prisma.js";

export type UpsertTaxConfigInput = {
  regimeLabel: string;
  estimatedRate: number;
  dueDay: number;
  notes?: string | undefined;
};

export class TaxConfigRepository {
  async findCurrent() {
    return prisma.taxConfig.findUnique({
      where: {
        singletonKey: "default"
      }
    });
  }

  async upsert(input: UpsertTaxConfigInput) {
    return prisma.taxConfig.upsert({
      where: {
        singletonKey: "default"
      },
      update: toTaxConfigData(input),
      create: {
        singletonKey: "default",
        ...toTaxConfigData(input)
      }
    });
  }

  async findPayments() {
    return prisma.payment.findMany({
      select: {
        referenceMonth: true,
        receivedAmount: true
      }
    });
  }
}

function toTaxConfigData(input: UpsertTaxConfigInput) {
  const data: {
    regimeLabel: string;
    estimatedRate: number;
    dueDay: number;
    notes?: string;
  } = {
    regimeLabel: input.regimeLabel,
    estimatedRate: input.estimatedRate,
    dueDay: input.dueDay
  };

  if (input.notes !== undefined) {
    data.notes = input.notes;
  }

  return data;
}
