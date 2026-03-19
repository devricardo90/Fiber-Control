import { AppError } from "../../lib/app-error.js";
import type { ReportsRepository } from "./reports.repository.js";

type PaymentByMonthRecord = Awaited<ReturnType<ReportsRepository["findPaymentsByReferenceMonth"]>>[number];
type PaymentByYearRecord = Awaited<ReturnType<ReportsRepository["findPaymentsByYear"]>>[number];
type OverdueCustomerRecord = Awaited<ReturnType<ReportsRepository["findOverdueCustomers"]>>[number];
type CustomerDetailRecord = NonNullable<Awaited<ReturnType<ReportsRepository["findCustomerDetail"]>>>;

export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getMonthlyRevenueReport(referenceMonth?: string) {
    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const payments = await this.reportsRepository.findPaymentsByReferenceMonth(anchorMonth);

    return {
      referenceMonth: anchorMonth,
      summary: {
        totalPayments: payments.length,
        expectedAmount: sumPayments(payments, "expectedAmount"),
        receivedAmount: sumPayments(payments, "receivedAmount"),
        outstandingAmount: sumOutstanding(payments)
      },
      payments: payments.map(mapMonthlyPayment)
    };
  }

  async getAnnualSummaryReport(year?: string) {
    const anchorYear = year ? Number(year) : new Date().getUTCFullYear();

    if (!Number.isInteger(anchorYear) || anchorYear < 2000 || anchorYear > 9999) {
      throw new AppError(400, "INVALID_YEAR", "Year must use YYYY");
    }

    const payments = await this.reportsRepository.findPaymentsByYear(anchorYear);
    const monthlyBreakdown = buildMonthlyBreakdown(payments);

    return {
      year: anchorYear,
      summary: {
        totalPayments: payments.length,
        totalExpectedAmount: sumPayments(payments, "expectedAmount"),
        totalReceivedAmount: sumPayments(payments, "receivedAmount"),
        totalOutstandingAmount: sumOutstanding(payments)
      },
      monthlyBreakdown
    };
  }

  async getOverdueReport() {
    const customers = await this.reportsRepository.findOverdueCustomers();

    return {
      summary: {
        totalCustomers: customers.length,
        overdueCustomers: customers.filter((customer) => customer.status === "OVERDUE").length,
        suspendedCustomers: customers.filter((customer) => customer.status === "SUSPENDED").length,
        totalOutstandingAmount: customers.reduce((total, customer) => {
          return total + customer.payments.reduce((paymentTotal, payment) => {
            return paymentTotal + Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0);
          }, 0);
        }, 0)
      },
      customers: customers.map(mapOverdueCustomer)
    };
  }

  async getRegionReport(referenceMonth?: string) {
    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const regions = await this.reportsRepository.findRegionsWithPayments(anchorMonth);

    return {
      referenceMonth: anchorMonth,
      regions: regions.map((region) => {
        const expectedAmount = region.customers.reduce((total, customer) => {
          const payment = customer.payments[0];
          return total + Number(payment?.expectedAmount ?? customer.monthlyFee);
        }, 0);
        const receivedAmount = region.customers.reduce((total, customer) => {
          return total + Number(customer.payments[0]?.receivedAmount ?? 0);
        }, 0);

        return {
          regionId: region.id,
          regionName: region.name,
          customerCount: region.customers.length,
          expectedAmount,
          receivedAmount,
          outstandingAmount: Math.max(expectedAmount - receivedAmount, 0)
        };
      })
    };
  }

  async getCustomerDetailReport(customerId: string) {
    const customer = await this.reportsRepository.findCustomerDetail(customerId);

    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "Customer was not found");
    }

    return mapCustomerDetail(customer);
  }
}

function mapMonthlyPayment(payment: PaymentByMonthRecord) {
  return {
    id: payment.id,
    customerId: payment.customerId,
    customerName: payment.customer.fullName,
    regionName: payment.customer.region?.name ?? null,
    expectedAmount: Number(payment.expectedAmount),
    receivedAmount: Number(payment.receivedAmount),
    outstandingAmount: Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0),
    status: mapPaymentStatus(payment.status)
  };
}

function buildMonthlyBreakdown(payments: PaymentByYearRecord[]) {
  const months = new Map<string, { expectedAmount: number; receivedAmount: number; outstandingAmount: number }>();

  for (const payment of payments) {
    const bucket = months.get(payment.referenceMonth) ?? {
      expectedAmount: 0,
      receivedAmount: 0,
      outstandingAmount: 0
    };

    bucket.expectedAmount += Number(payment.expectedAmount);
    bucket.receivedAmount += Number(payment.receivedAmount);
    bucket.outstandingAmount += Math.max(
      Number(payment.expectedAmount) - Number(payment.receivedAmount),
      0
    );
    months.set(payment.referenceMonth, bucket);
  }

  return Array.from(months.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([referenceMonth, values]) => ({
      referenceMonth,
      ...values
    }));
}

function mapOverdueCustomer(customer: OverdueCustomerRecord) {
  const outstandingAmount = customer.payments.reduce((total, payment) => {
    return total + Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0);
  }, 0);

  return {
    id: customer.id,
    fullName: customer.fullName,
    status: mapCustomerStatus(customer.status),
    regionName: customer.region?.name ?? null,
    monthlyFee: Number(customer.monthlyFee),
    outstandingAmount,
    latestReferenceMonth: customer.payments[0]?.referenceMonth ?? null
  };
}

function mapCustomerDetail(customer: CustomerDetailRecord) {
  return {
    id: customer.id,
    fullName: customer.fullName,
    status: mapCustomerStatus(customer.status),
    regionName: customer.region?.name ?? null,
    serviceStartDate: customer.serviceStartDate?.toISOString().slice(0, 10) ?? null,
    monthlyFee: Number(customer.monthlyFee),
    totalPaidAmount: customer.payments.reduce((total, payment) => total + Number(payment.receivedAmount), 0),
    totalOutstandingAmount: customer.payments.reduce((total, payment) => {
      return total + Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0);
    }, 0),
    payments: customer.payments.map((payment) => ({
      id: payment.id,
      referenceMonth: payment.referenceMonth,
      expectedAmount: Number(payment.expectedAmount),
      receivedAmount: Number(payment.receivedAmount),
      outstandingAmount: Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0),
      status: mapPaymentStatus(payment.status),
      paidAt: payment.paidAt?.toISOString() ?? null
    }))
  };
}

function sumPayments<T extends { expectedAmount: unknown; receivedAmount: unknown }>(
  payments: T[],
  field: "expectedAmount" | "receivedAmount"
) {
  return payments.reduce((total, payment) => total + Number(payment[field]), 0);
}

function sumOutstanding<T extends { expectedAmount: unknown; receivedAmount: unknown }>(payments: T[]) {
  return payments.reduce((total, payment) => {
    return total + Math.max(Number(payment.expectedAmount) - Number(payment.receivedAmount), 0);
  }, 0);
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

function getCurrentReferenceMonth() {
  return new Date().toISOString().slice(0, 7);
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}
