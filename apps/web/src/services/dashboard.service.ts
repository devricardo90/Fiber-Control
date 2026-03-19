import { apiRequest } from "@/lib/api";
import type {
  AlertsOverview,
  AnnualSummaryReport,
  FinanceOverview,
  OverdueReport,
  RegionReport
} from "@/types/dashboard";

export async function getFinanceOverview(token: string, referenceMonth?: string) {
  const query = referenceMonth ? `?referenceMonth=${referenceMonth}` : "";
  const response = await apiRequest<{ data: FinanceOverview }>(`/finance/overview${query}`, {
    method: "GET",
    token
  });
  return response.data;
}

export async function getAlertsOverview(token: string, referenceDate?: string) {
  const query = referenceDate ? `?referenceDate=${referenceDate}` : "";
  const response = await apiRequest<{ data: AlertsOverview }>(`/alerts/overview${query}`, {
    method: "GET",
    token
  });
  return response.data;
}

export async function getOverdueReport(token: string) {
  const response = await apiRequest<{ data: OverdueReport }>("/reports/overdue", {
    method: "GET",
    token
  });
  return response.data;
}

export async function getAnnualSummary(token: string, year?: string) {
  const query = year ? `?year=${year}` : "";
  const response = await apiRequest<{ data: AnnualSummaryReport }>(`/reports/annual-summary${query}`, {
    method: "GET",
    token
  });
  return response.data;
}

export async function getRegionReport(token: string, referenceMonth?: string) {
  const query = referenceMonth ? `?referenceMonth=${referenceMonth}` : "";
  const response = await apiRequest<{ data: RegionReport }>(`/reports/regions${query}`, {
    method: "GET",
    token
  });
  return response.data;
}
