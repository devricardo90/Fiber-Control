"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { apiRequest } from "@/lib/api";

type MonthlyRevenueReport = {
  referenceMonth: string;
  summary: {
    totalPayments: number;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  };
  payments: Array<{
    id: string;
    customerId: string;
    customerName: string;
    regionName: string | null;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
    status: "pending" | "paid" | "partial" | "failed";
  }>;
};

type AnnualSummaryReport = {
  year: number;
  summary: {
    totalPayments: number;
    totalExpectedAmount: number;
    totalReceivedAmount: number;
    totalOutstandingAmount: number;
  };
  monthlyBreakdown: Array<{
    referenceMonth: string;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  }>;
};

type OverdueReport = {
  summary: {
    totalCustomers: number;
    overdueCustomers: number;
    suspendedCustomers: number;
    totalOutstandingAmount: number;
  };
  customers: Array<{
    id: string;
    fullName: string;
    status: "overdue" | "suspended";
    regionName: string | null;
    monthlyFee: number;
    outstandingAmount: number;
    latestReferenceMonth: string | null;
  }>;
};

type RegionReport = {
  referenceMonth: string;
  regions: Array<{
    regionId: string;
    regionName: string;
    customerCount: number;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  }>;
};

type ReportsOverview = {
  monthlyRevenue: MonthlyRevenueReport;
  annualSummary: AnnualSummaryReport;
  overdue: OverdueReport;
  regions: RegionReport;
};

export function ReportsScreen() {
  const [referenceMonth, setReferenceMonth] = useState(getCurrentReferenceMonth());

  const reportsQuery = useQuery({
    queryKey: ["reports-overview", referenceMonth],
    queryFn: async (): Promise<ReportsOverview> => {
      const year = referenceMonth.slice(0, 4);
      const [monthlyRevenue, annualSummary, overdue, regions] = await Promise.all([
        apiRequest<{ data: MonthlyRevenueReport }>(
          `/reports/monthly-revenue?referenceMonth=${referenceMonth}`
        ),
        apiRequest<{ data: AnnualSummaryReport }>(`/reports/annual-summary?year=${year}`),
        apiRequest<{ data: OverdueReport }>("/reports/overdue"),
        apiRequest<{ data: RegionReport }>(`/reports/regions?referenceMonth=${referenceMonth}`)
      ]);

      return {
        monthlyRevenue: monthlyRevenue.data,
        annualSummary: annualSummary.data,
        overdue: overdue.data,
        regions: regions.data
      };
    }
  });

  const overview = reportsQuery.data;
  const topRegions = overview?.regions.regions.slice(0, 4) ?? [];
  const highlightedPayments = overview?.monthlyRevenue.payments.slice(0, 5) ?? [];
  const overdueCustomers = overview?.overdue.customers.slice(0, 5) ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Operational overview of revenue, overdue exposure and regional concentration."
        badge={
          <StatusChip
            label={overview ? `Reference ${overview.monthlyRevenue.referenceMonth}` : "Reports overview"}
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
          value={formatCurrency(overview?.monthlyRevenue.summary.receivedAmount ?? 0)}
        />
        <SummaryCard
          label="Outstanding this month"
          value={formatCurrency(overview?.monthlyRevenue.summary.outstandingAmount ?? 0)}
        />
        <SummaryCard
          label="Outstanding this year"
          value={formatCurrency(overview?.annualSummary.summary.totalOutstandingAmount ?? 0)}
        />
        <SummaryCard
          label="Overdue customers"
          value={String(overview?.overdue.summary.overdueCustomers ?? 0)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Panel
          title="Reporting baseline"
          description="Overview only in FC-013. Detailed report routes stay outside this task."
          headerAction={
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
          }
        >
          {reportsQuery.isLoading ? (
            <p className="text-sm text-[var(--fc-text-soft)]">Loading reports overview...</p>
          ) : reportsQuery.isError ? (
            <p className="text-sm text-[var(--fc-danger)]">
              Failed to load reports overview from the API boundary.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ReadingCard
                  label="Annual received"
                  value={formatCurrency(overview?.annualSummary.summary.totalReceivedAmount ?? 0)}
                  description="Collected amount in the selected year."
                />
                <ReadingCard
                  label="Annual expected"
                  value={formatCurrency(overview?.annualSummary.summary.totalExpectedAmount ?? 0)}
                  description="Expected billing baseline for the selected year."
                />
                <ReadingCard
                  label="Suspended customers"
                  value={String(overview?.overdue.summary.suspendedCustomers ?? 0)}
                  description="Customers already escalated beyond overdue tolerance."
                />
                <ReadingCard
                  label="Total overdue exposure"
                  value={formatCurrency(overview?.overdue.summary.totalOutstandingAmount ?? 0)}
                  description="Combined overdue and suspended outstanding amount."
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <TableCard
                  title="Monthly payment signal"
                  emptyLabel="No payments found for the selected month."
                  headers={["Customer", "Region", "Status", "Outstanding"]}
                  rows={highlightedPayments.map((payment) => [
                    payment.customerName,
                    payment.regionName ?? "No region",
                    formatPaymentStatus(payment.status),
                    formatCurrency(payment.outstandingAmount)
                  ])}
                />

                <TableCard
                  title="Regional concentration"
                  emptyLabel="No regional data found for the selected month."
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

        <Panel title="FC-013 boundary" description="Controlled reopening for reports overview only.">
          <div className="space-y-3">
            <BoundaryRow
              title="Overview route"
              description="`/reports` is reopened by aggregating stable contracts from the reports module."
              label="Reopened"
              tone="success"
            />
            <BoundaryRow
              title="Detailed reports"
              description="`/reports/monthly-revenue`, `/reports/overdue` and `/reports/regions` remain outside FC-013."
              label="Out of scope"
              tone="warning"
            />
            <BoundaryRow
              title="Customer drilldown"
              description="`GET /reports/customers/:id` remains available only as backend contract for now."
              label="Out of scope"
              tone="warning"
            />
          </div>

          <div className="mt-4 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              Current annual baseline
            </p>
            <p className="mt-2 text-sm text-[var(--fc-text)]">
              {overview?.annualSummary.year ?? referenceMonth.slice(0, 4)}
            </p>
            <p className="mt-1 text-sm text-[var(--fc-text-soft)]">
              This surface stays overview-only in FC-013.
            </p>
          </div>

          <div className="mt-4 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              Highest exposure
            </p>
            {overdueCustomers.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--fc-text-soft)]">No overdue customers in the current dataset.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {overdueCustomers.slice(0, 3).map((customer) => (
                  <div
                    key={customer.id}
                    className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-[var(--fc-text)]">{customer.fullName}</strong>
                      <StatusChip
                        label={formatCustomerStatus(customer.status)}
                        tone={getCustomerStatusTone(customer.status)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-[var(--fc-text-soft)]">
                      {customer.regionName ?? "No region"} | {customer.latestReferenceMonth ?? "No reference"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--fc-text)]">
                      {formatCurrency(customer.outstandingAmount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-[var(--fc-text)]">{value}</p>
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

function BoundaryRow({
  description,
  label,
  title,
  tone
}: {
  title: string;
  description: string;
  label: string;
  tone: "success" | "warning";
}) {
  return (
    <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm text-[var(--fc-text)]">{title}</strong>
        <StatusChip label={label} tone={tone} />
      </div>
      <p className="mt-2 text-sm text-[var(--fc-text-soft)]">{description}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatPaymentStatus(status: MonthlyRevenueReport["payments"][number]["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatCustomerStatus(status: OverdueReport["customers"][number]["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getCustomerStatusTone(
  status: OverdueReport["customers"][number]["status"]
): "warning" | "danger" {
  if (status === "suspended") {
    return "warning";
  }

  return "danger";
}

function getCurrentReferenceMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
