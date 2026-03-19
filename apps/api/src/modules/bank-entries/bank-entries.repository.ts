import type { BankEntry } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateBankEntryRepositoryInput = {
  amount: number;
  occurredAt: Date;
  description?: string | undefined;
  referenceCode?: string | undefined;
  source?: string | undefined;
};

export class BankEntriesRepository {
  async create(input: CreateBankEntryRepositoryInput) {
    return bankEntryDelegate().create({
      data: toCreateData(input),
      include: {
        payment: {
          include: {
            customer: true
          }
        }
      }
    });
  }

  async findMany() {
    return bankEntryDelegate().findMany({
      include: {
        payment: {
          include: {
            customer: true
          }
        }
      },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }]
    });
  }

  async findById(entryId: string) {
    return bankEntryDelegate().findUnique({
      where: {
        id: entryId
      },
      include: {
        payment: {
          include: {
            customer: true
          }
        }
      }
    });
  }

  async matchToPayment(entryId: string, paymentId: string) {
    return bankEntryDelegate().update({
      where: {
        id: entryId
      },
      data: {
        paymentId,
        status: "MATCHED"
      },
      include: {
        payment: {
          include: {
            customer: true
          }
        }
      }
    });
  }
}

type BankEntryDelegate = {
  create(args: {
    data: Record<string, unknown>;
    include: {
      payment: {
        include: {
          customer: true;
        };
      };
    };
  }): Promise<BankEntry & {
    payment: {
      id: string;
      referenceMonth: string;
      customer: {
        id: string;
        fullName: string;
      };
    } | null;
  }>;
  findMany(args: {
    include: {
      payment: {
        include: {
          customer: true;
        };
      };
    };
    orderBy: Array<Record<string, "asc" | "desc">>;
  }): Promise<Array<BankEntry & {
    payment: {
      id: string;
      referenceMonth: string;
      customer: {
        id: string;
        fullName: string;
      };
    } | null;
  }>>;
  findUnique(args: {
    where: { id: string };
    include: {
      payment: {
        include: {
          customer: true;
        };
      };
    };
  }): Promise<(BankEntry & {
    payment: {
      id: string;
      referenceMonth: string;
      customer: {
        id: string;
        fullName: string;
      };
    } | null;
  }) | null>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
    include: {
      payment: {
        include: {
          customer: true;
        };
      };
    };
  }): Promise<BankEntry & {
    payment: {
      id: string;
      referenceMonth: string;
      customer: {
        id: string;
        fullName: string;
      };
    } | null;
  }>;
};

function bankEntryDelegate() {
  return (prisma as unknown as { bankEntry: BankEntryDelegate }).bankEntry;
}

function toCreateData(input: CreateBankEntryRepositoryInput) {
  const data: {
    amount: number;
    occurredAt: Date;
    description?: string;
    referenceCode?: string;
    source?: string;
  } = {
    amount: input.amount,
    occurredAt: input.occurredAt
  };

  if (input.description !== undefined) data.description = input.description;
  if (input.referenceCode !== undefined) data.referenceCode = input.referenceCode;
  if (input.source !== undefined) data.source = input.source;

  return data;
}
