"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { TextField, TextareaField } from "@/components/foundation/field";
import { useAuth } from "@/components/layout/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import type { ApiError } from "@/lib/api";
import { apiRequest } from "@/lib/api";

const paymentSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  referenceMonth: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Reference month must follow YYYY-MM"),
  receivedAmount: z.coerce.number().min(0, "Received amount must be zero or positive"),
  paidAt: z.string().optional(),
  notes: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;
type PaymentFormInput = z.input<typeof paymentSchema>;
type CustomerRecord = {
  id: string;
  fullName: string;
  status: string;
  monthlyFee: number;
};

export function RegisterPaymentScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customersQuery = useQuery({
    queryKey: ["payment-customers", token],
    queryFn: async () => {
      const response = await apiRequest<{ data: CustomerRecord[] }>("/customers", { token });
      return response.data;
    },
    enabled: Boolean(token)
  });

  const form = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerId: "",
      referenceMonth: getCurrentReferenceMonth(),
      receivedAmount: 0,
      paidAt: "",
      notes: ""
    }
  });

  async function onSubmit(values: PaymentFormValues) {
    setSubmitError(null);

    try {
      await apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify({
          customerId: values.customerId,
          referenceMonth: values.referenceMonth,
          receivedAmount: values.receivedAmount,
          paidAt: values.paidAt ? new Date(`${values.paidAt}T12:00:00.000Z`).toISOString() : undefined,
          notes: values.notes || undefined
        }),
        token
      });
      router.push("/payments");
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitError(apiError.message ?? "Failed to register payment.");
    }
  }

  const customers = customersQuery.data ?? [];
  const selectedCustomer = customers.find((customer) => customer.id === form.watch("customerId")) ?? null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Register payment"
        description="Register a monthly payment with customer, reference month and received amount."
        badge={<StatusChip label="FC-010 active surface" tone="success" />}
        actions={
          <Link href="/payments">
            <FoundationButton variant="secondary">Back to list</FoundationButton>
          </Link>
        }
      />

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Panel title="Payment payload" description="Keep the first registration flow direct and operational.">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldWithError error={form.formState.errors.customerId?.message}>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                    Customer *
                  </span>
                  <select
                    className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                    {...form.register("customerId")}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.fullName}
                      </option>
                    ))}
                  </select>
                </label>
              </FieldWithError>

              <FieldWithError error={form.formState.errors.referenceMonth?.message}>
                <TextField label="Reference month *" placeholder="2026-04" {...form.register("referenceMonth")} />
              </FieldWithError>

              <FieldWithError error={form.formState.errors.receivedAmount?.message}>
                <TextField
                  label="Received amount *"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register("receivedAmount")}
                />
              </FieldWithError>

              <FieldWithError error={form.formState.errors.paidAt?.message}>
                <TextField label="Paid at" type="date" {...form.register("paidAt")} />
              </FieldWithError>
            </div>

            <div className="mt-4">
              <TextareaWithError
                label="Operational note"
                placeholder="Short context for partial payment, exception or reconciliation follow-up."
                error={form.formState.errors.notes?.message}
                {...form.register("notes")}
              />
            </div>
          </Panel>

          <Panel title="Current reading" description="Immediate context before submitting the payment.">
            <div className="space-y-3">
              <BoundaryRow
                title="List route"
                description="`/payments` is reopened in this task."
                label="Reopened"
                tone="success"
              />
              <BoundaryRow
                title="Create route"
                description="`/payments/new` is reopened in this task."
                label="Reopened"
                tone="success"
              />
              <BoundaryRow
                title="Reconciliation"
                description="Bank matching remains outside FC-010."
                label="Out of scope"
                tone="warning"
              />
            </div>

            <div className="mt-4 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Selected customer
              </p>
              <p className="mt-2 text-sm text-[var(--fc-text)]">
                {selectedCustomer ? selectedCustomer.fullName : "No customer selected"}
              </p>
              <p className="mt-1 text-sm text-[var(--fc-text-soft)]">
                {selectedCustomer
                  ? `Status: ${formatCustomerStatus(selectedCustomer.status)} | Monthly fee: ${formatCurrency(selectedCustomer.monthlyFee)}`
                  : "Choose a customer to confirm the baseline amount."}
              </p>
            </div>
          </Panel>
        </section>

        {customersQuery.isLoading ? (
          <p className="text-sm text-[var(--fc-text-soft)]">Loading customer options...</p>
        ) : null}
        {customersQuery.isError ? (
          <p className="text-sm text-[var(--fc-danger)]">
            Failed to load customers. The payment cannot be registered without a valid customer.
          </p>
        ) : null}

        {submitError ? (
          <div className="rounded-md border border-[#edc0c0] bg-[var(--fc-danger-soft)] px-3 py-2 text-sm text-[var(--fc-danger)]">
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
          <FoundationButton variant="secondary" onClick={() => router.push("/payments")}>
            Cancel
          </FoundationButton>
          <FoundationButton
            type="submit"
            variant="primary"
            disabled={form.formState.isSubmitting || customersQuery.isError}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save payment"}
          </FoundationButton>
        </div>
      </form>
    </div>
  );
}

function FieldWithError({
  children,
  error
}: {
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      {children}
      {error ? <p className="text-xs text-[var(--fc-danger)]">{error}</p> : null}
    </div>
  );
}

function TextareaWithError({
  error,
  ...props
}: ComponentProps<typeof TextareaField> & { error?: string }) {
  return (
    <FieldWithError error={error}>
      <TextareaField {...props} />
    </FieldWithError>
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

function formatCustomerStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCurrentReferenceMonth() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
