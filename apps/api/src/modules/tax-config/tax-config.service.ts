import { AppError } from "../../lib/app-error.js";
import type { TaxConfigRepository, UpsertTaxConfigInput } from "./tax-config.repository.js";

type TaxConfigRecord = NonNullable<Awaited<ReturnType<TaxConfigRepository["findCurrent"]>>>;

export class TaxConfigService {
  constructor(private readonly taxConfigRepository: TaxConfigRepository) {}

  async getTaxConfig() {
    const taxConfig = await this.taxConfigRepository.findCurrent();

    return taxConfig ? mapTaxConfig(taxConfig) : null;
  }

  async upsertTaxConfig(input: UpsertTaxConfigInput) {
    const taxConfig = await this.taxConfigRepository.upsert(input);

    return mapTaxConfig(taxConfig);
  }

  async getTaxEstimate(referenceMonth?: string) {
    const taxConfig = await this.taxConfigRepository.findCurrent();

    if (!taxConfig) {
      throw new AppError(404, "TAX_CONFIG_NOT_FOUND", "Tax config was not found");
    }

    const anchorMonth = referenceMonth ?? getCurrentReferenceMonth();

    if (!isReferenceMonthValid(anchorMonth)) {
      throw new AppError(400, "INVALID_REFERENCE_MONTH", "Reference month must use YYYY-MM");
    }

    const payments = await this.taxConfigRepository.findPayments();
    const anchorYear = Number(anchorMonth.slice(0, 4));
    const grossRevenueThisMonth = sumRevenue(
      payments.filter((payment) => payment.referenceMonth === anchorMonth)
    );
    const grossRevenueThisYear = sumRevenue(
      payments.filter((payment) => Number(payment.referenceMonth.slice(0, 4)) === anchorYear)
    );
    const rate = Number(taxConfig.estimatedRate);

    return {
      referenceMonth: anchorMonth,
      regimeLabel: taxConfig.regimeLabel,
      estimatedRate: rate,
      dueDay: taxConfig.dueDay,
      notes: taxConfig.notes,
      grossRevenueThisMonth,
      grossRevenueThisYear,
      estimatedTaxThisMonth: calculateEstimatedTax(grossRevenueThisMonth, rate),
      estimatedTaxThisYear: calculateEstimatedTax(grossRevenueThisYear, rate)
    };
  }
}

function mapTaxConfig(taxConfig: TaxConfigRecord) {
  return {
    id: taxConfig.id,
    regimeLabel: taxConfig.regimeLabel,
    estimatedRate: Number(taxConfig.estimatedRate),
    dueDay: taxConfig.dueDay,
    notes: taxConfig.notes,
    createdAt: taxConfig.createdAt.toISOString(),
    updatedAt: taxConfig.updatedAt.toISOString()
  };
}

function getCurrentReferenceMonth() {
  return new Date().toISOString().slice(0, 7);
}

function isReferenceMonthValid(referenceMonth: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
}

function sumRevenue(payments: Array<{ receivedAmount: unknown }>) {
  return payments.reduce((total, payment) => total + Number(payment.receivedAmount), 0);
}

function calculateEstimatedTax(grossRevenue: number, estimatedRate: number) {
  return Number(((grossRevenue * estimatedRate) / 100).toFixed(2));
}
