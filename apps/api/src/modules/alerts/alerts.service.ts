import { AppError } from "../../lib/app-error.js";
import type { AlertsRepository } from "./alerts.repository.js";

type CustomerRecord = Awaited<
  ReturnType<AlertsRepository["findCustomersForReferenceMonth"]>
>[number];

type AlertOverviewItem = {
  type: "overdue_customer" | "cutoff_soon" | "pending_payment";
  severity: "high" | "medium" | "low";
  code: string;
  message: string;
  customer: {
    id: string;
    fullName: string;
    status: string;
    regionName: string | null;
  };
  payment: {
    referenceMonth: string;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  };
  daysLate?: number;
  daysUntilCutoff?: number;
  daysUntilDue?: number;
};

export class AlertsService {
  constructor(private readonly alertsRepository: AlertsRepository) {}

  async getOverview(referenceDate?: string) {
    const anchorDate = parseReferenceDate(referenceDate);
    const referenceMonth = anchorDate.toISOString().slice(0, 7);
    const customers = await this.alertsRepository.findCustomersForReferenceMonth(referenceMonth);
    const alerts: AlertOverviewItem[] = customers.flatMap((customer) =>
      buildCustomerAlerts(customer, anchorDate)
    );

    return {
      referenceDate: anchorDate.toISOString().slice(0, 10),
      referenceMonth,
      summary: {
        totalAlerts: alerts.length,
        overdueCustomers: alerts.filter((alert) => alert.type === "overdue_customer").length,
        customersReachingCutoff: alerts.filter((alert) => alert.type === "cutoff_soon").length,
        pendingPayments: alerts.filter((alert) => alert.type === "pending_payment").length
      },
      alerts
    };
  }
}

function buildCustomerAlerts(customer: CustomerRecord, anchorDate: Date): AlertOverviewItem[] {
  const expectedAmount = Number(customer.monthlyFee);
  const currentPayment = customer.payments[0] ?? null;
  const receivedAmount = currentPayment ? Number(currentPayment.receivedAmount) : 0;
  const outstandingAmount = Math.max(expectedAmount - receivedAmount, 0);

  if (outstandingAmount === 0) {
    return [];
  }

  const dueDate = buildMonthDate(anchorDate, customer.dueDay);
  const graceLimitDate = addDays(dueDate, customer.graceDays);
  const cutoffDate = addDays(dueDate, customer.cutoffDays);
  const daysUntilCutoff = diffInDays(anchorDate, cutoffDate);
  const daysPastGrace = diffInDays(graceLimitDate, anchorDate);
  const baseAlert = {
    customer: {
      id: customer.id,
      fullName: customer.fullName,
      status: mapCustomerStatus(customer.status),
      regionName: customer.region?.name ?? null
    },
    payment: {
      referenceMonth: anchorDate.toISOString().slice(0, 7),
      expectedAmount,
      receivedAmount,
      outstandingAmount
    }
  };

  const isAccountOverdue = customer.status === "OVERDUE";
  const isDateOverdue = anchorDate > graceLimitDate;

  if (isAccountOverdue || isDateOverdue) {
    return [
      {
        type: "overdue_customer",
        severity: "high",
        code: "CUSTOMER_OVERDUE",
        message: `${customer.fullName} is overdue for ${baseAlert.payment.referenceMonth}`,
        daysLate: isDateOverdue ? daysPastGrace : 0,
        ...baseAlert
      }
    ];
  }

  if (daysUntilCutoff >= 0 && daysUntilCutoff <= 2) {
    return [
      {
        type: "cutoff_soon",
        severity: "medium",
        code: "CUSTOMER_REACHING_CUTOFF",
        message: `${customer.fullName} is approaching cutoff date`,
        daysUntilCutoff,
        ...baseAlert
      }
    ];
  }

  return [
    {
      type: "pending_payment",
      severity: "low",
      code: "PAYMENT_PENDING",
      message: `${customer.fullName} still has an open balance for ${baseAlert.payment.referenceMonth}`,
      daysUntilDue: diffInDays(anchorDate, dueDate),
      ...baseAlert
    }
  ];
}

function parseReferenceDate(referenceDate?: string) {
  if (!referenceDate) {
    return normalizeDate(new Date());
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

function normalizeDate(date: Date) {
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

function buildMonthDate(anchorDate: Date, day: number) {
  const year = anchorDate.getUTCFullYear();
  const month = anchorDate.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const boundedDay = Math.min(day, lastDay);

  return new Date(Date.UTC(year, month, boundedDay));
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function diffInDays(baseDate: Date, targetDate: Date) {
  const dayInMs = 24 * 60 * 60 * 1000;
  return Math.floor((targetDate.getTime() - baseDate.getTime()) / dayInMs);
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
