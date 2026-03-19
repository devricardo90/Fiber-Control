import type { CustomerStatus, Prisma } from "../../generated/prisma/client.js";

type CustomerStatusContext = Prisma.CustomerGetPayload<{
  include: {
    payments: true;
  };
}>;

export class CustomerStatusService {
  recalculateStatus(customer: CustomerStatusContext, referenceDate = new Date()): CustomerStatus {
    if (customer.status === "INACTIVE") {
      return "INACTIVE";
    }

    const normalizedReferenceDate = normalizeDate(referenceDate);
    const referenceMonth = normalizedReferenceDate.toISOString().slice(0, 7);
    const payment = customer.payments.find((item) => item.referenceMonth === referenceMonth) ?? null;
    const receivedAmount = payment ? Number(payment.receivedAmount) : 0;
    const expectedAmount = Number(customer.monthlyFee);

    if (receivedAmount >= expectedAmount) {
      return "ACTIVE";
    }

    const dueDate = buildMonthDate(normalizedReferenceDate, customer.dueDay);

    if (normalizedReferenceDate.getTime() === dueDate.getTime()) {
      return "DUE_TODAY";
    }

    const cutoffDate = addDays(dueDate, customer.cutoffDays);

    if (normalizedReferenceDate > cutoffDate) {
      return "SUSPENDED";
    }

    const graceDate = addDays(dueDate, customer.graceDays);

    if (normalizedReferenceDate > graceDate) {
      return "OVERDUE";
    }

    return "ACTIVE";
  }
}

function normalizeDate(date: Date) {
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

function buildMonthDate(referenceDate: Date, dueDay: number) {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return new Date(Date.UTC(year, month, Math.min(dueDay, lastDay)));
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}
