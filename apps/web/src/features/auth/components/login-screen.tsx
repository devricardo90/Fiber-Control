"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api";

import { type LoginFormData, loginSchema } from "../schemas/login-schema";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      router.replace("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message);
    }
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className="auth-shell">
      <section className="login-hero">
        <div className="login-hero-content">
          <span className="login-kicker">
            <span className="login-kicker-dot" />
            Network Infrastructure
          </span>
          <h1>
            The Intelligent
            <br />
            Connectivity Core.
          </h1>
          <p>
            Effortlessly manage your enterprise fiber network with advanced operational visibility,
            recurring billing control and field intelligence in one place.
          </p>

          <div className="hero-metrics">
            <div className="hero-metric-card">
              <ShieldCheck size={22} />
              <strong>99.9%</strong>
              <span>Uptime Reliability</span>
            </div>
            <div className="hero-metric-card">
              <UserRound size={22} />
              <strong>14.2k</strong>
              <span>Active Nodes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel-content">
          <div className="login-brand">
            <span>FiberControl</span>
            <span className="brand-line" />
          </div>

          <header>
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access the SaaS platform.</p>
          </header>

          <div className="inline-error" style={{ marginBottom: 20 }}>
            Local access: <strong>acesso@fibercontrol.local</strong> / <strong>Fiber@123456</strong>
          </div>

          <form className="login-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Work Email
              </label>
              <div className="input-shell">
                <UserRound aria-hidden="true" size={18} />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  aria-invalid={Boolean(emailError)}
                  className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus:border-0 focus:shadow-none"
                  {...form.register("email")}
                />
              </div>
              {emailError ? <span className="field-error">{emailError}</span> : null}
            </div>

            <div className="field-group">
              <div className="field-row">
                <label className="field-label" htmlFor="password">
                  Secure Password
                </label>
                <button type="button" className="text-button">
                  Forgot?
                </button>
              </div>
              <div className="input-shell">
                <LockKeyhole aria-hidden="true" size={18} />
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(passwordError)}
                  className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus:border-0 focus:shadow-none"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError ? <span className="field-error">{passwordError}</span> : null}
            </div>

            <label className="checkbox-row">
              <Checkbox {...form.register("keepLoggedIn")} />
              <span>Keep me logged in</span>
            </label>

            {errorMessage ? <div className="inline-error">{errorMessage}</div> : null}

            <Button
              className="submit-button"
              type="submit"
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <footer className="login-footer">
            <p>Protected by Fiber Control Cloud Security.</p>
            <button type="button" className="text-button" style={{ marginTop: 12 }}>
              Request Admin Access
            </button>
          </footer>

          <div className="security-mark">
            <ShieldCheck size={64} />
          </div>
        </div>
      </section>
    </main>
  );
}
