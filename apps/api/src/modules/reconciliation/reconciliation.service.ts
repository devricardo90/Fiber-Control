import { AppError } from "../../lib/app-error.js";
import { BankEntriesRepository } from "../bank-entries/bank-entries.repository.js";
import { CustomerStatusService } from "../customers/customer-status.service.js";
import { PaymentsRepository } from "../payments/payments.repository.js";
import type { ReconciliationRepository } from "./reconciliation.repository.js";

type MatchedBankEntry = Awaited<ReturnType<BankEntriesRepository["matchToPayment"]>>;

export class ReconciliationService {
  constructor(
    private readonly reconciliationRepository: ReconciliationRepository,
    private readonly bankEntriesRepository = new BankEntriesRepository(),
    private readonly paymentsRepository = new PaymentsRepository(),
    private readonly customerStatusService = new CustomerStatusService()
  ) {}

  async matchBankEntryToPayment(input: { bankEntryId: string; paymentId: string }) {
    const bankEntry = await this.bankEntriesRepository.findById(input.bankEntryId);

    if (!bankEntry) {
      throw new AppError(404, "BANK_ENTRY_NOT_FOUND", "Bank entry was not found");
    }

    if (bankEntry.paymentId || bankEntry.status === "MATCHED") {
      throw new AppError(409, "BANK_ENTRY_ALREADY_MATCHED", "Bank entry is already matched");
    }

    const payment = await this.paymentsRepository.findById(input.paymentId);

    if (!payment) {
      throw new AppError(404, "PAYMENT_NOT_FOUND", "Payment was not found");
    }

    const nextReceivedAmount = Number(payment.receivedAmount) + Number(bankEntry.amount);
    const expectedAmount = Number(payment.expectedAmount);

    if (nextReceivedAmount > expectedAmount) {
      throw new AppError(
        400,
        "BANK_ENTRY_EXCEEDS_PAYMENT",
        "Bank entry amount exceeds the outstanding payment amount"
      );
    }

    const nextStatus = derivePaymentStatus(nextReceivedAmount, expectedAmount);
    const updatedPayment = await this.paymentsRepository.updatePaymentAmounts(payment.id, {
      receivedAmount: nextReceivedAmount,
      status: nextStatus,
      paidAt: nextStatus === "PENDING" ? null : payment.paidAt ?? bankEntry.occurredAt
    });
    const matchedEntry = await this.bankEntriesRepository.matchToPayment(bankEntry.id, payment.id);
    const customerWithPayments = await this.paymentsRepository.findCustomerById(updatedPayment.customerId);

    if (!customerWithPayments) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    const recalculatedStatus = this.customerStatusService.recalculateStatus(customerWithPayments);
    await this.paymentsRepository.updateCustomerStatus(updatedPayment.customerId, recalculatedStatus);

    return {
      bankEntry: mapMatchedBankEntry(matchedEntry),
      payment: {
        id: updatedPayment.id,
        customerId: updatedPayment.customerId,
        referenceMonth: updatedPayment.referenceMonth,
        expectedAmount: Number(updatedPayment.expectedAmount),
        receivedAmount: Number(updatedPayment.receivedAmount),
        status: mapPaymentStatus(updatedPayment.status),
        paidAt: updatedPayment.paidAt?.toISOString() ?? null
      }
    };
  }

  async getOverview(referenceMonth?: string) {
    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const bankEntries = await this.reconciliationRepository.findBankEntriesForMonth(anchorMonth);
    const payments = await this.reconciliationRepository.findPaymentsForMonth(anchorMonth);
    const matchedEntries = bankEntries.filter((entry) => entry.status === "MATCHED");
    const unmatchedEntries = bankEntries.filter((entry) => entry.status === "UNMATCHED");
    const missingPayments = payments.filter(
      (payment) => Number(payment.receivedAmount) < Number(payment.expectedAmount)
    );

    return {
      referenceMonth: anchorMonth,
      summary: {
        matchedEntries: matchedEntries.length,
        unmatchedEntries: unmatchedEntries.length,
        missingPayments: missingPayments.length,
        matchedAmount: sumAmount(matchedEntries),
        unmatchedAmount: sumAmount(unmatchedEntries),
        missingAmount: missingPayments.reduce((total, payment) => {
          return total + Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0);
        }, 0)
      },
      unmatchedEntries: unmatchedEntries.map((entry) => ({
        id: entry.id,
        amount: Number(entry.amount),
        occurredAt: entry.occurredAt.toISOString(),
        description: entry.description,
        referenceCode: entry.referenceCode,
        source: entry.source
      })),
      missingPayments: missingPayments.map((payment) => ({
        id: payment.id,
        customerId: payment.customerId,
        customerName: payment.customer.fullName,
        referenceMonth: payment.referenceMonth,
        expectedAmount: Number(payment.expectedAmount),
        receivedAmount: Number(payment.receivedAmount),
        outstandingAmount: Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0),
        status: mapPaymentStatus(payment.status)
      }))
    };
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

function mapMatchedBankEntry(entry: MatchedBankEntry) {
  return {
    id: entry.id,
    amount: Number(entry.amount),
    occurredAt: entry.occurredAt.toISOString(),
    description: entry.description,
    referenceCode: entry.referenceCode,
    source: entry.source,
    status: entry.status.toLowerCase(),
    payment: entry.payment
      ? {
          id: entry.payment.id,
          referenceMonth: entry.payment.referenceMonth,
          customer: {
            id: entry.payment.customer.id,
            fullName: entry.payment.customer.fullName
          }
        }
      : null
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

function getCurrentReferenceMonth() {
  return new Date().toISOString().slice(0, 7);
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}

function sumAmount(items: Array<{ amount: number | { toString(): string } }>) {
  return items.reduce((total, item) => total + Number(item.amount), 0);
}
