import { AppError } from "../../lib/app-error.js";
import type { FinanceRepository } from "./finance.repository.js";

type PaymentRecord = Awaited<ReturnType<FinanceRepository["findPayments"]>>[number];

export class FinanceService {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async getOverview(referenceMonth?: string) {
    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const payments = await this.financeRepository.findPayments();
    const anchorYear = Number(anchorMonth.slice(0, 4));

    return {
      referenceMonth: anchorMonth,
      totalReceivedThisMonth: sumAmounts(
        payments.filter((payment) => payment.referenceMonth === anchorMonth),
        "receivedAmount"
      ),
      totalReceivedThisYear: sumAmounts(
        payments.filter((payment) => getYear(payment.referenceMonth) === anchorYear),
        "receivedAmount"
      ),
      totalReceivedLastYear: sumAmounts(
        payments.filter((payment) => getYear(payment.referenceMonth) === anchorYear - 1),
        "receivedAmount"
      ),
      expectedRevenueThisMonth: sumAmounts(
        payments.filter((payment) => payment.referenceMonth === anchorMonth),
        "expectedAmount"
      ),
      overdueAmount: sumOutstanding(
        payments.filter((payment) => payment.referenceMonth < anchorMonth)
      ),
      outstandingAmount: sumOutstanding(payments)
    };
  }
}

function getCurrentReferenceMonth() {
  return new Date().toISOString().slice(0, 7);
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}

function getYear(referenceMonth: string) {
  return Number(referenceMonth.slice(0, 4));
}

function sumAmounts(
  payments: PaymentRecord[],
  field: "expectedAmount" | "receivedAmount"
) {
  return payments.reduce((total, payment) => total + Number(payment[field]), 0);
}

function sumOutstanding(payments: PaymentRecord[]) {
  return payments.reduce((total, payment) => {
    const outstanding = Number(payment.expectedAmount) - Number(payment.receivedAmount);

    return total + Math.max(outstanding, 0);
  }, 0);
}
