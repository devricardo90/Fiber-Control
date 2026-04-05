"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/layout/auth-provider";
import { FoundationButton } from "@/components/foundation/button";
import type { ApiError } from "@/lib/api";

import { type LoginFormData, loginSchema } from "../schemas/login-schema";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepLoggedIn: true
    }
  });

  async function handleSubmit(values: LoginFormData) {
    setErrorMessage(null);

    try {
      await login(values.email, values.password);
      router.replace("/workspace");
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message);
    }
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fc-bg)] px-4 py-10">
      <section className="w-full max-w-4xl overflow-hidden rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] shadow-sm lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
            Fiber Control
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--fc-text)]">
            Operational access for internal workflows
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--fc-text-soft)]">
            This frontend foundation is intentionally restrained. The shell prioritizes navigation,
            filters, tables, status reading and direct API integration over marketing presentation.
          </p>

          <div className="mt-6 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              Local access
            </p>
            <p className="mt-2 text-sm text-[var(--fc-text)]">acesso@fibercontrol.local</p>
            <p className="text-sm text-[var(--fc-text)]">Fiber@123456</p>
          </div>
        </div>

        <div className="p-6">
          <header>
            <h2 className="text-xl font-semibold text-[var(--fc-text)]">Sign in</h2>
            <p className="mt-2 text-sm text-[var(--fc-text-soft)]">
              Start an authenticated session to validate the frontend base.
            </p>
          </header>

          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(emailError)}
                className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                {...form.register("email")}
              />
              {emailError ? <span className="text-xs text-[var(--fc-danger)]">{emailError}</span> : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter current password"
                aria-invalid={Boolean(passwordError)}
                className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
                {...form.register("password")}
              />
              {passwordError ? (
                <span className="text-xs text-[var(--fc-danger)]">{passwordError}</span>
              ) : null}
            </label>

            <label className="flex items-center gap-2 text-sm text-[var(--fc-text-soft)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-[var(--fc-border)]"
                {...form.register("keepLoggedIn")}
              />
              <span>Keep session active on this device</span>
            </label>

            {errorMessage ? (
              <div className="rounded-md border border-[#edc0c0] bg-[var(--fc-danger-soft)] px-3 py-2 text-sm text-[var(--fc-danger)]">
                {errorMessage}
              </div>
            ) : null}

            <FoundationButton
              className="w-full"
              type="submit"
              variant="primary"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </FoundationButton>
          </form>
        </div>
      </section>
    </main>
  );
}
