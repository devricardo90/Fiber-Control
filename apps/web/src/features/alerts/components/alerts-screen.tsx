"use client";

import { useQuery } from "@tanstack/react-query";

import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { getAlertsOverview } from "@/services/dashboard.service";
import type { AlertsOverview } from "@/types/dashboard";

export function AlertsScreen() {
  const today = getTodayIsoDate();

  const alertsQuery = useQuery({
    queryKey: ["alerts-overview-page", today],
    queryFn: () => getAlertsOverview("", today)
  });

  const data = alertsQuery.data;
  const alerts = data?.alerts ?? [];
  const overdueFromAlerts = new Set(
    alerts
      .filter((a) => a.type === "overdue_customer" || a.customer.status === "overdue")
      .map((a) => a.customer.id)
  ).size;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Alerts"
        description="Operational attention points for overdue customers, cutoff windows and pending balances."
        badge={<StatusChip label={data ? data.referenceMonth : "Alerts overview"} tone="info" />}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total alerts" value={String(data?.summary.totalAlerts ?? 0)} />
        <SummaryCard label="Overdue customers" value={String(overdueFromAlerts)} />
        <SummaryCard label="Pending payment" value={String(data?.summary.pendingPayments ?? 0)} />
        <SummaryCard label="Cutoff soon" value={String(data?.summary.customersReachingCutoff ?? 0)} />
      </section>

      <Panel
        title="Active alerts"
        description="Customers requiring immediate attention for the current billing period."
      >
        {alertsQuery.isLoading ? (
          <p className="text-sm text-[var(--fc-text-soft)]">Loading alerts...</p>
        ) : alertsQuery.isError ? (
          <p className="text-sm text-[var(--fc-danger)]">
            Failed to load alerts from the API boundary.
          </p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-[var(--fc-text-soft)]">
            No active alerts for the current period.
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={`${alert.code}-${alert.customer.id}-${alert.payment.referenceMonth}`}
                className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-[var(--fc-text)]">{alert.customer.fullName}</strong>
                  <StatusChip
                    label={formatSeverity(alert.severity)}
                    tone={getSeverityTone(alert.severity)}
                  />
                </div>
                <p className="mt-2 text-sm text-[var(--fc-text-soft)]">{alert.message}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--fc-text-muted)]">
                  <span>Period: {alert.payment.referenceMonth}</span>
                  <span>Outstanding: {formatCurrency(alert.payment.outstandingAmount)}</span>
                  {alert.customer.regionName ? (
                    <span>Region: {alert.customer.regionName}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
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

function formatSeverity(severity: AlertsOverview["alerts"][number]["severity"]) {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function getSeverityTone(
  severity: AlertsOverview["alerts"][number]["severity"]
): "danger" | "warning" | "info" {
  if (severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "info";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
