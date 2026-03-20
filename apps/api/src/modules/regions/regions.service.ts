import { AppError } from "../../lib/app-error.js";
import type { RegionsRepository } from "./regions.repository.js";

type RegionRecord = Awaited<ReturnType<RegionsRepository["findRegionsWithPerformanceData"]>>[number];

export class RegionsService {
  constructor(private readonly regionsRepository: RegionsRepository) {}

  async getPerformance(referenceMonth?: string) {
    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const regions = await this.regionsRepository.findRegionsWithPerformanceData(anchorMonth);
    const items = regions.map((region) => mapRegionPerformance(region, anchorMonth));

    return {
      referenceMonth: anchorMonth,
      summary: {
        totalRegions: items.length,
        totalCustomers: items.reduce((total, item) => total + item.customerCount, 0),
        totalReceivedAmount: sumBy(items, (item) => item.receivedAmount),
        totalExpectedAmount: sumBy(items, (item) => item.expectedAmount),
        totalOutstandingAmount: sumBy(items, (item) => item.outstandingAmount),
        totalOverdueCustomers: items.reduce((total, item) => total + item.overdueCustomers, 0)
      },
      regions: items
    };
  }

  async listRegions() {
    return this.regionsRepository.findAll();
  }
}

function mapRegionPerformance(region: RegionRecord, referenceMonth: string) {
  const customerCount = region.customers.length;
  const activeCustomers = region.customers.filter((customer) => customer.status === "ACTIVE").length;
  const overdueCustomers = region.customers.filter((customer) =>
    customer.status === "OVERDUE" || customer.status === "SUSPENDED"
  ).length;
  const receivedAmount = region.customers.reduce((total, customer) => {
    const payment = customer.payments[0];
    return total + Number(payment?.receivedAmount ?? 0);
  }, 0);
  const expectedAmount = region.customers.reduce((total, customer) => {
    const payment = customer.payments[0];
    return total + Number(payment?.expectedAmount ?? customer.monthlyFee);
  }, 0);
  const outstandingAmount = Math.max(expectedAmount - receivedAmount, 0);

  return {
    regionId: region.id,
    regionName: region.name,
    regionCode: region.code,
    referenceMonth,
    customerCount,
    activeCustomers,
    overdueCustomers,
    expectedAmount,
    receivedAmount,
    outstandingAmount,
    collectionRate: expectedAmount === 0 ? 0 : Number(((receivedAmount / expectedAmount) * 100).toFixed(2))
  };
}

function getCurrentReferenceMonth() {
  return new Date().toISOString().slice(0, 7);
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}

function sumBy<T>(items: T[], getValue: (item: T) => number) {
  return items.reduce((total, item) => total + getValue(item), 0);
}
