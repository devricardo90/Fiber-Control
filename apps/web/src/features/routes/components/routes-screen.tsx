"use client";

import Link from "next/link";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";

import { routeAttention, routeQueue, routeSummary } from "../data/routes-data";

export function RoutesScreen() {
  const readyCount = routeQueue.filter((item) => item.status === "Ready").length;
  const attentionCount = routeQueue.filter((item) => item.status === "Attention").length;
  const blockedCount = routeQueue.filter((item) => item.status === "Blocked").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Routes"
        description="Operational overview of route load, dispatch readiness and blocked follow-up."
        badge={<StatusChip label="Overview" tone="info" />}
        actions={
          <Link href="/regions">
            <FoundationButton variant="secondary">Open regions</FoundationButton>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {routeSummary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section>
        <Panel
          title="Dispatch baseline"
          description="Operational queue for dispatch review and readiness tracking."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <ReadingCard
              label="Ready queue"
              value={String(readyCount)}
              description="Visits with scheduled window, assigned team and no current blocker."
            />
            <ReadingCard
              label="Attention queue"
              value={String(attentionCount)}
              description="Visits that need operational review before dispatch confirmation."
            />
            <ReadingCard
              label="Blocked queue"
              value={String(blockedCount)}
              description="Visits waiting on stock, assignment or external confirmation."
            />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {["Route", "Customer", "Issue", "Window", "Technician", "Status"].map((header) => (
                    <th
                      key={header}
                      className="border-b border-[var(--fc-border)] px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routeQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3 text-sm font-medium text-[var(--fc-text)]">
                      {item.id}
                    </td>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--fc-text)]">{item.customer}</p>
                        <p className="text-sm text-[var(--fc-text-soft)]">{item.region}</p>
                      </div>
                    </td>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3 text-sm text-[var(--fc-text-soft)]">
                      {item.issue}
                    </td>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3 text-sm text-[var(--fc-text)]">
                      {item.scheduledWindow}
                    </td>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3 text-sm text-[var(--fc-text)]">
                      {item.technician}
                    </td>
                    <td className="border-b border-[var(--fc-border)] px-3 py-3">
                      <StatusChip label={item.status} tone={getStatusTone(item.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function getStatusTone(status: "Ready" | "Attention" | "Blocked"): "success" | "warning" | "danger" {
  if (status === "Ready") {
    return "success";
  }

  if (status === "Attention") {
    return "warning";
  }

  return "danger";
}
