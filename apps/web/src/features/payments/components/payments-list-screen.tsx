"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { useAuth } from "@/components/layout/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import { apiRequest } from "@/lib/api";

type PaymentRecord = {
  id: string;
  customerId: string;
  referenceMonth: string;
  expectedAmount: number;
  receivedAmount: number;
  status: "pending" | "paid" | "partial" | "failed";
  paidAt: string | null;
  notes: string | null;
  customer: {
    id: string;
    fullName: string;
    status: string;
  };
};

export function PaymentsListScreen() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const paymentsQuery = useQuery({
    queryKey: ["payments", token],
    queryFn: async () => {
      const response = await apiRequest<{ data: PaymentRecord[] }>("/payments", { token });
      return response.data;
    },
    enabled: Boolean(token)
  });

  const payments = paymentsQuery.data ?? [];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPayments = !normalizedSearch
    ? payments
    : payments.filter((payment) => {
        return (
          payment.customer.fullName.toLowerCase().includes(normalizedSearch) ||
          payment.referenceMonth.toLowerCase().includes(normalizedSearch)
        );
      });

  const summary = buildSummary(payments);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payments"
        description="Monthly billing records with customer, amount and payment status."
        badge={<StatusChip label={`${payments.length} records`} tone="info" />}
        actions={
          <Link href="/payments/new">
            <FoundationButton variant="primary">Register payment</FoundationButton>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Panel key={item.label}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--fc-text)]">{item.value}</p>
          </Panel>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Panel
          title="Payment ledger"
          description="Search by customer or reference month. Detail flow remains outside FC-010."
          headerAction={
            <div className="w-full max-w-xs">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                  Search
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Customer or month"
                  className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                />
              </label>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-md border border-[var(--fc-border)]">
            <table className="min-w-full border-collapse bg-[var(--fc-surface)] text-sm">
              <thead className="bg-[var(--fc-surface-muted)]">
                <tr>
                  <th className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Customer
                  </th>
                  <th className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Reference
                  </th>
                  <th className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Expected
                  </th>
                  <th className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Received
                  </th>
                  <th className="border-b border-[var(--fc-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentsQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`loading-${index}`} className="odd:bg-white even:bg-[#fafbfd]">
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        Loading payment...
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        Loading...
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        Loading...
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        Loading...
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        Loading...
                      </td>
                    </tr>
                  ))
                ) : paymentsQuery.isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-[var(--fc-border)] px-3 py-8 text-center text-[var(--fc-danger)]"
                    >
                      Failed to load payments from the API boundary.
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-[var(--fc-border)] px-3 py-8 text-center text-[var(--fc-text-soft)]"
                    >
                      No payment matches the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="odd:bg-white even:bg-[#fafbfd]">
                      <td className="border-b border-[var(--fc-border)] px-3 py-3">
                        <div className="flex flex-col gap-1">
                          <strong className="text-sm text-[var(--fc-text)]">
                            {payment.customer.fullName}
                          </strong>
                          <span className="text-xs text-[var(--fc-text-muted)]">
                            Customer status: {formatCustomerStatus(payment.customer.status)}
                          </span>
                        </div>
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        {payment.referenceMonth}
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        {formatCurrency(payment.expectedAmount)}
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3 text-[var(--fc-text-soft)]">
                        {formatCurrency(payment.receivedAmount)}
                      </td>
                      <td className="border-b border-[var(--fc-border)] px-3 py-3">
                        <StatusChip
                          label={formatPaymentStatus(payment.status)}
                          tone={getPaymentTone(payment.status)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="FC-010 boundary" description="Controlled reopening for payments list and create.">
          <div className="space-y-3">
            <BoundaryRow
              title="List route"
              description="`/payments` is active again with dense ledger reading."
              label="Reopened"
              tone="success"
            />
            <BoundaryRow
              title="Create route"
              description="`/payments/new` is active again with the first registration flow."
              label="Reopened"
              tone="success"
            />
            <BoundaryRow
              title="Reconciliation"
              description="Bank matching remains outside this task and stays in its own module."
              label="Out of scope"
              tone="warning"
            />
          </div>
        </Panel>
      </section>
    </div>
  );
}

function buildSummary(payments: PaymentRecord[]) {
  let expected = 0;
  let received = 0;
  let pending = 0;
  let partial = 0;

  for (const payment of payments) {
    expected += payment.expectedAmount;
    received += payment.receivedAmount;

    if (payment.status === "pending") {
      pending += payment.expectedAmount;
    }

    if (payment.status === "partial") {
      partial += payment.expectedAmount - payment.receivedAmount;
    }
  }

  return [
    { label: "Expected", value: formatCurrency(expected) },
    { label: "Received", value: formatCurrency(received) },
    { label: "Pending", value: formatCurrency(pending) },
    { label: "Partial gap", value: formatCurrency(partial) }
  ];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatPaymentStatus(status: PaymentRecord["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatCustomerStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPaymentTone(status: PaymentRecord["status"]): "success" | "warning" | "danger" | "neutral" {
  if (status === "paid") {
    return "success";
  }

  if (status === "partial") {
    return "warning";
  }

  if (status === "failed") {
    return "danger";
  }

  return "neutral";
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
