"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { getAlertsOverview, getAnnualSummary, getFinanceOverview, getRegionReport } from "@/services/dashboard.service";
import type { AlertsOverview, AnnualSummaryReport, FinanceOverview, RegionReport } from "@/types/dashboard";

type DashboardOverview = {
  finance: FinanceOverview;
  alerts: AlertsOverview;
  annualSummary: AnnualSummaryReport;
  regions: RegionReport;
};

export function DashboardScreen() {
  const [referenceMonth, setReferenceMonth] = useState(getCurrentReferenceMonth());
  const [referenceDate, setReferenceDate] = useState(getTodayIsoDate());

  const dashboardQuery = useQuery({
    queryKey: ["dashboard-overview", referenceMonth, referenceDate],
    queryFn: async (): Promise<DashboardOverview> => {
      const year = referenceMonth.slice(0, 4);
      const [finance, alerts, annualSummary, regions] = await Promise.all([
        getFinanceOverview("", referenceMonth),
        getAlertsOverview("", referenceDate),
        getAnnualSummary("", year),
        getRegionReport("", referenceMonth)
      ]);

      return {
        finance,
        alerts,
        annualSummary,
        regions
      };
    }
  });

  const overview = dashboardQuery.data;
  const topRegions = overview?.regions.regions.slice(0, 4) ?? [];
  const topAlerts = overview?.alerts.alerts.slice(0, 4) ?? [];
  const annualTrend = overview?.annualSummary.monthlyBreakdown.slice(-4) ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Operational command view across finance, alerts, reports and regional concentration."
        badge={
          <StatusChip
            label={overview ? `Month ${overview.finance.referenceMonth}` : "Dashboard overview"}
            tone="info"
          />
        }
        actions={
          <Link href="/finance">
            <FoundationButton variant="secondary">Open finance</FoundationButton>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Received this month"
          value={formatCurrency(overview?.finance.totalReceivedThisMonth ?? 0)}
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(overview?.finance.outstandingAmount ?? 0)}
        />
        <SummaryCard
          label="Active alerts"
          value={String(overview?.alerts.summary.totalAlerts ?? 0)}
        />
        <SummaryCard
          label="Overdue customers"
          value={String(overview?.alerts.summary.overdueCustomers ?? 0)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Panel
          title="Operation metrics"
          description="Consolidated operational view of the current period."
          headerAction={
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                  Reference month
                </span>
                <input
                  type="month"
                  value={referenceMonth}
                  onChange={(event) => setReferenceMonth(event.target.value)}
                  className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                  Reference date
                </span>
                <input
                  type="date"
                  value={referenceDate}
                  onChange={(event) => setReferenceDate(event.target.value)}
                  className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                />
              </label>
            </div>
          }
        >
          {dashboardQuery.isLoading ? (
            <p className="text-sm text-[var(--fc-text-soft)]">Loading dashboard overview...</p>
          ) : dashboardQuery.isError ? (
            <p className="text-sm text-[var(--fc-danger)]">
              Failed to load dashboard overview from the API boundary.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ReadingCard
                  label="Expected revenue"
                  value={formatCurrency(overview?.finance.expectedRevenueThisMonth ?? 0)}
                  description="Projected billing for the selected month."
                />
                <ReadingCard
                  label="Yearly collection"
                  value={formatCurrency(overview?.annualSummary.summary.totalReceivedAmount ?? 0)}
                  description="Total amount collected in the current fiscal year."
                />
                <ReadingCard
                  label="Risk of suspension"
                  value={String(overview?.alerts.summary.customersReachingCutoff ?? 0)}
                  description="Customers approaching service cutoff due to non-payment."
                />
                <ReadingCard
                  label="Pending billing"
                  value={String(overview?.alerts.summary.pendingPayments ?? 0)}
                  description="Unpaid invoices flagged for collection review."
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <TableCard
                  title="Revenue trend"
                  emptyLabel="No revenue trend data found for the selected year."
                  headers={["Month", "Expected", "Received", "Outstanding"]}
                  rows={annualTrend.map((item) => [
                    item.referenceMonth,
                    formatCurrency(item.expectedAmount),
                    formatCurrency(item.receivedAmount),
                    formatCurrency(item.outstandingAmount)
                  ])}
                />

                <TableCard
                  title="Regional distribution"
                  emptyLabel="No regional performance found for the selected month."
                  headers={["Region", "Customers", "Received", "Outstanding"]}
                  rows={topRegions.map((region) => [
                    region.regionName,
                    String(region.customerCount),
                    formatCurrency(region.receivedAmount),
                    formatCurrency(region.outstandingAmount)
                  ])}
                />
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Real-time alerts" description="Prioritized operational and financial alerts.">
          <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              High priority
            </p>
            {topAlerts.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--fc-text-soft)]">No critical alerts found.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {topAlerts.map((alert) => (
                  <div
                    key={`${alert.code}-${alert.customer.id}-${alert.payment.referenceMonth}`}
                    className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-[var(--fc-text)]">{alert.customer.fullName}</strong>
                      <StatusChip label={formatSeverity(alert.severity)} tone={getSeverityTone(alert.severity)} />
                    </div>
                    <p className="mt-2 text-sm text-[var(--fc-text-soft)]">{alert.message}</p>
                    <p className="mt-2 text-xs text-[var(--fc-text-muted)]">{alert.payment.referenceMonth}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
             <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              Operational status
            </p>
            <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm text-[var(--fc-text)]">Billing engine</strong>
                <StatusChip label="Online" tone="success" />
              </div>
              <p className="mt-2 text-sm text-[var(--fc-text-soft)]">Automated invoice generation and payment tracking active.</p>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="border-t-4 border-t-[var(--fc-primary)]">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--fc-primary)]">{value}</p>
    </Panel>
  );
}

function ReadingCard({
  description,
  label,
  value
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-[var(--fc-text)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--fc-text-soft)]">{description}</p>
    </div>
  );
}

function TableCard({
  title,
  headers,
  rows,
  emptyLabel
}: {
  title: string;
  headers: string[];
  rows: string[][];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
      <h3 className="text-sm font-semibold text-[var(--fc-text)]">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--fc-text-soft)]">{emptyLabel}</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)]">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[var(--fc-surface-muted)]">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="odd:bg-white even:bg-[#fafbfd]">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${title}-${index}-${cellIndex}`}
                      className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatSeverity(severity: AlertsOverview["alerts"][number]["severity"]) {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function getSeverityTone(severity: AlertsOverview["alerts"][number]["severity"]): "danger" | "warning" | "info" {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "info";
}

function getCurrentReferenceMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
