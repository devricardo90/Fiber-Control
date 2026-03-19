import { AppError } from "../../lib/app-error.js";
import type {
  BankEntriesRepository,
  CreateBankEntryRepositoryInput
} from "./bank-entries.repository.js";

type BankEntryRecord = Awaited<ReturnType<BankEntriesRepository["create"]>>;

type CreateBankEntryInput = Omit<CreateBankEntryRepositoryInput, "occurredAt"> & {
  occurredAt: string;
};

export class BankEntriesService {
  constructor(private readonly bankEntriesRepository: BankEntriesRepository) {}

  async createEntry(input: CreateBankEntryInput) {
    const occurredAt = parseOccurredAt(input.occurredAt);
    const entry = await this.bankEntriesRepository.create({
      amount: input.amount,
      occurredAt,
      description: input.description,
      referenceCode: input.referenceCode,
      source: input.source
    });

    return mapBankEntry(entry);
  }

  async listEntries() {
    const entries = await this.bankEntriesRepository.findMany();

    return entries.map(mapBankEntry);
  }
}

function mapBankEntry(entry: BankEntryRecord) {
  return {
    id: entry.id,
    amount: Number(entry.amount),
    occurredAt: entry.occurredAt.toISOString(),
    description: entry.description,
    referenceCode: entry.referenceCode,
    source: entry.source,
    status: mapStatus(entry.status),
    payment: entry.payment
      ? {
          id: entry.payment.id,
          referenceMonth: entry.payment.referenceMonth,
          customer: {
            id: entry.payment.customer.id,
            fullName: entry.payment.customer.fullName
          }
        }
      : null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString()
  };
}

function parseOccurredAt(occurredAt: string) {
  const parsedDate = new Date(occurredAt);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, "INVALID_OCCURRED_AT", "Occurred at must be a valid datetime");
  }

  return parsedDate;
}

function mapStatus(status: string) {
  const statusMap: Record<string, string> = {
    UNMATCHED: "unmatched",
    MATCHED: "matched"
  };

  return statusMap[status] ?? status.toLowerCase();
}
