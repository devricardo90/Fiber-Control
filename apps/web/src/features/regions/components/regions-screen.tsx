"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { apiRequest } from "@/lib/api";

type RegionCatalogItem = {
  id: string;
  name: string;
  code: string | null;
};

type RegionPerformanceItem = {
  regionId: string;
  regionName: string;
  regionCode: string | null;
  referenceMonth: string;
  customerCount: number;
  activeCustomers: number;
  overdueCustomers: number;
  expectedAmount: number;
  receivedAmount: number;
  outstandingAmount: number;
  collectionRate: number;
};

type RegionsPerformance = {
  referenceMonth: string;
  summary: {
    totalRegions: number;
    totalCustomers: number;
    totalReceivedAmount: number;
    totalExpectedAmount: number;
    totalOutstandingAmount: number;
    totalOverdueCustomers: number;
  };
  regions: RegionPerformanceItem[];
};

type RegionsOverview = {
  catalog: RegionCatalogItem[];
  performance: RegionsPerformance;
};

export function RegionsScreen() {
  const [referenceMonth, setReferenceMonth] = useState(getCurrentReferenceMonth());

  const regionsQuery = useQuery({
    queryKey: ["regions-overview", referenceMonth],
    queryFn: async (): Promise<RegionsOverview> => {
      const [catalog, performance] = await Promise.all([
        apiRequest<{ data: RegionCatalogItem[] }>("/regions"),
        apiRequest<{ data: RegionsPerformance }>(`/regions/performance?referenceMonth=${referenceMonth}`)
      ]);

      return {
        catalog: catalog.data,
        performance: performance.data
      };
    }
  });

  const overview = regionsQuery.data;
  const regions = overview?.performance.regions ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Regions"
        description="Operational overview of regional coverage, collection rate and outstanding concentration."
        badge={
          <StatusChip
            label={overview ? `Reference ${overview.performance.referenceMonth}` : "Regions overview"}
            tone="info"
          />
        }
        actions={
          <Link href="/customers">
            <FoundationButton variant="secondary">Open customers</FoundationButton>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Tracked regions"
          value={String(overview?.performance.summary.totalRegions ?? 0)}
        />
        <SummaryCard
          label="Customers"
          value={String(overview?.performance.summary.totalCustomers ?? 0)}
        />
        <SummaryCard
          label="Collection rate"
          value={formatRate(overview?.performance.regions)}
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(overview?.performance.summary.totalOutstandingAmount ?? 0)}
        />
      </section>

      <section>
        <Panel
          title="Regional baseline"
          description="Aggregate metrics and collection performance across regional network."
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
          {regionsQuery.isLoading ? (
            <p className="text-sm text-[var(--fc-text-soft)]">Loading regional overview...</p>
          ) : regionsQuery.isError ? (
            <p className="text-sm text-[var(--fc-danger)]">
              Failed to load regional overview from the API boundary.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ReadingCard
                  label="Received amount"
                  value={formatCurrency(overview?.performance.summary.totalReceivedAmount ?? 0)}
                  description="Collected amount across all regions for the selected month."
                />
                <ReadingCard
                  label="Expected amount"
                  value={formatCurrency(overview?.performance.summary.totalExpectedAmount ?? 0)}
                  description="Expected billing baseline across the regional network."
                />
                <ReadingCard
                  label="Overdue customers"
                  value={String(overview?.performance.summary.totalOverdueCustomers ?? 0)}
                  description="Customers in overdue status across all tracked regions."
                />
                <ReadingCard
                  label="Region catalog"
                  value={String(overview?.catalog.length ?? 0)}
                  description="Registered region entries currently available in the module."
                />
              </div>

              <TableCard
                title="Regional performance"
                emptyLabel="No regional performance found for the selected month."
                headers={["Region", "Customers", "Overdue", "Received", "Outstanding", "Rate"]}
                rows={regions.map((region) => [
                  region.regionName,
                  String(region.customerCount),
                  String(region.overdueCustomers),
                  formatCurrency(region.receivedAmount),
                  formatCurrency(region.outstandingAmount),
                  `${region.collectionRate.toFixed(2)}%`
                ])}
              />
            </div>
          )}
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatRate(regions?: RegionPerformanceItem[]) {
  if (!regions || regions.length === 0) {
    return "0.00%";
  }

  const expected = regions.reduce((total, region) => total + region.expectedAmount, 0);
  const received = regions.reduce((total, region) => total + region.receivedAmount, 0);

  if (expected === 0) {
    return "0.00%";
  }

  return `${((received / expected) * 100).toFixed(2)}%`;
}

function getCurrentReferenceMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
