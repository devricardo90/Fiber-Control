import { prisma } from "../../lib/prisma.js";

export class ReconciliationRepository {
  async findBankEntriesForMonth(referenceMonth: string) {
    const startDate = new Date(`${referenceMonth}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);

    return bankEntryDelegate().findMany({
      where: {
        occurredAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        payment: {
          include: {
            customer: true
          }
        }
      },
      orderBy: [{ occurredAt: "desc" }]
    });
  }

  async findPaymentsForMonth(referenceMonth: string) {
    return prisma.payment.findMany({
      where: {
        referenceMonth
      },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}

type BankEntryDelegate = {
  findMany(args: {
    where: {
      occurredAt: {
        gte: Date;
        lt: Date;
      };
    };
    include: {
      payment: {
        include: {
          customer: true;
        };
      };
    };
    orderBy: Array<Record<string, "asc" | "desc">>;
  }): Promise<Array<{
    id: string;
    amount: { toString(): string } | number;
    occurredAt: Date;
    description: string | null;
    referenceCode: string | null;
    source: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    payment: {
      id: string;
      referenceMonth: string;
      customer: {
        id: string;
        fullName: string;
      };
    } | null;
  }>>;
};

function bankEntryDelegate() {
  return (prisma as unknown as { bankEntry: BankEntryDelegate }).bankEntry;
}
