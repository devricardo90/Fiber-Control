"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { apiRequest } from "@/lib/api";

type FinanceOverview = {
  referenceMonth: string;
  totalReceivedThisMonth: number;
  totalReceivedThisYear: number;
  totalReceivedLastYear: number;
  expectedRevenueThisMonth: number;
  overdueAmount: number;
  outstandingAmount: number;
};

export function FinanceOverviewScreen() {
  const [referenceMonth, setReferenceMonth] = useState(getCurrentReferenceMonth());

  const financeQuery = useQuery({
    queryKey: ["finance-overview", referenceMonth],
    queryFn: async () => {
      const response = await apiRequest<{ data: FinanceOverview }>(
        `/finance/overview?referenceMonth=${referenceMonth}`
      );
      return response.data;
    }
  });

  const overview = financeQuery.data;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Finance"
        description="Operational overview of monthly revenue, outstanding values and overdue exposure."
        badge={
          <StatusChip
            label={overview ? `Reference ${overview.referenceMonth}` : "Finance overview"}
            tone="info"
          />
        }
        actions={
          <Link href="/payments">
            <FoundationButton variant="secondary">Open payments</FoundationButton>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Received this month"
          value={formatCurrency(overview?.totalReceivedThisMonth ?? 0)}
        />
        <SummaryCard
          label="Expected revenue"
          value={formatCurrency(overview?.expectedRevenueThisMonth ?? 0)}
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(overview?.outstandingAmount ?? 0)}
        />
        <SummaryCard
          label="Overdue"
          value={formatCurrency(overview?.overdueAmount ?? 0)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Panel
          title="Financial baseline"
          description="Overview only in FC-012. Reports and fiscal settings stay outside this task."
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
          {financeQuery.isLoading ? (
            <p className="text-sm text-[var(--fc-text-soft)]">Loading finance overview...</p>
          ) : financeQuery.isError ? (
            <p className="text-sm text-[var(--fc-danger)]">
              Failed to load finance overview from the API boundary.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <ReadingCard
                label="Received this year"
                value={formatCurrency(overview?.totalReceivedThisYear ?? 0)}
                description="Collected amount in the current year until the selected month."
              />
              <ReadingCard
                label="Received last year"
                value={formatCurrency(overview?.totalReceivedLastYear ?? 0)}
                description="Historical comparison baseline for the same overview."
              />
              <ReadingCard
                label="Expected this month"
                value={formatCurrency(overview?.expectedRevenueThisMonth ?? 0)}
                description="Expected gross billing for the selected month."
              />
              <ReadingCard
                label="Outstanding gap"
                value={formatCurrency(overview?.outstandingAmount ?? 0)}
                description="Open amount still pending collection in the selected month."
              />
            </div>
          )}
        </Panel>

        <Panel title="FC-012 boundary" description="Controlled reopening for finance overview only.">
          <div className="space-y-3">
            <BoundaryRow
              title="Overview route"
              description="`/finance` is reopened with the real overview contract `GET /finance/overview`."
              label="Reopened"
              tone="success"
            />
            <BoundaryRow
              title="Reports"
              description="Detailed reports remain outside FC-012."
              label="Out of scope"
              tone="warning"
            />
            <BoundaryRow
              title="Fiscal settings"
              description="Tax and fiscal configuration remain outside this task."
              label="Out of scope"
              tone="warning"
            />
          </div>

          <div className="mt-4 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              Current reference
            </p>
            <p className="mt-2 text-sm text-[var(--fc-text)]">
              {overview?.referenceMonth ?? referenceMonth}
            </p>
            <p className="mt-1 text-sm text-[var(--fc-text-soft)]">
              This surface stays overview-only in FC-012.
            </p>
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

function getCurrentReferenceMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
