'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/layout/auth-provider';
import { RevenueTrendChart } from '@/features/dashboard/components/revenue-trend-chart';
import { RegionalPerformance } from '@/features/dashboard/components/regional-performance';

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: revRes } = useQuery({
    queryKey: ['reports', 'revenue', token],
    queryFn: () => apiRequest<any>('/reports/monthly-revenue', { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token),
  });

  const { data: overRes } = useQuery({
    queryKey: ['reports', 'overdue', token],
    queryFn: () => apiRequest<any>('/reports/overdue', { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token),
  });

  const { data: annRes } = useQuery({
    queryKey: ['reports', 'annual-summary', currentYear, token],
    queryFn: () => apiRequest<any>(`/reports/annual-summary?year=${currentYear}`, { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token),
  });

  const { data: regRes } = useQuery({
    queryKey: ['reports', 'regions', currentMonth, token],
    queryFn: () => apiRequest<any>(`/reports/regions?referenceMonth=${currentMonth}`, { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token),
  });

  const revData = revRes?.data?.summary;
  const overdueData = overRes?.data?.summary;
  const annData = annRes?.data?.monthlyBreakdown ?? [];
  const regData = regRes?.data?.regions ?? [];

  const { data: payRes } = useQuery({
    queryKey: ['payments', 'recent', token],
    queryFn: () => apiRequest<any>('/payments', { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token),
  });

  const recentPayments = (payRes?.data || []).slice(0, 5);

  const fCurrency = (num = 0) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);

  const fNumber = (num = 0) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="bg-transparent text-[var(--color-on-surface)]">
      <div className="px-8 pb-14 min-h-screen">

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        {/*
          Responsive breakpoints accounting for 280px sidebar:
          - 1 col  : mobile
          - 2 cols : sm (640px+), content area ≥ 360px per card
          - 4 cols : 2xl (1536px+), content area ≥ 296px per card
          Cards wrap naturally at medium widths → no squeezing
        */}
        <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 mb-10">

          {/* Revenue This Month */}
          <div className="bg-[var(--color-surface-container-lowest)] p-7 rounded-2xl min-w-0 min-h-[180px] flex flex-col justify-between shadow-sm">
            <div className="min-w-0">
              <span className="block text-[var(--color-outline)] font-semibold text-[11px] uppercase tracking-widest truncate">
                Revenue This Month
              </span>
              <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-black text-[var(--color-primary)] leading-none tracking-tight truncate">
                {revData ? fCurrency(revData.receivedAmount) : '—'}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[var(--color-on-secondary-container)] min-w-0">
              <span className="material-symbols-outlined text-sm shrink-0">trending_up</span>
              <span className="text-sm font-bold truncate">+0% from last month</span>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-[var(--color-surface-container-lowest)] p-7 rounded-2xl min-w-0 min-h-[180px] flex flex-col justify-between shadow-sm">
            <div className="min-w-0">
              <span className="block text-[var(--color-outline)] font-semibold text-[11px] uppercase tracking-widest truncate">
                Active Customers
              </span>
              <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-black text-[var(--color-primary)] leading-none tracking-tight truncate">
                {overdueData ? fNumber(overdueData.totalCustomers) : '—'}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[var(--color-outline)] min-w-0">
              <span className="material-symbols-outlined text-sm shrink-0">person_check</span>
              <span className="text-sm font-medium truncate">94% Retention rate</span>
            </div>
          </div>

          {/* Overdue Customers */}
          <div className="bg-[var(--color-error-container)] p-7 rounded-2xl min-w-0 min-h-[180px] flex flex-col justify-between shadow-sm">
            <div className="min-w-0">
              <span className="block text-[var(--color-on-error-container)] font-semibold text-[11px] uppercase tracking-widest truncate">
                Overdue Customers
              </span>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black text-[var(--color-on-error-container)] leading-none tracking-tight">
                  {overdueData?.overdueCustomers ?? '—'}
                </h3>
                <span className="inline-flex shrink-0 items-center bg-[var(--color-error)] text-[var(--color-on-error)] text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide">
                  ACTION REQ
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[var(--color-on-error-container)] min-w-0">
              <span className="material-symbols-outlined text-sm shrink-0">warning</span>
              <span className="text-sm font-medium truncate">Requires follow-up</span>
            </div>
          </div>

          {/* Suspended Today */}
          <div className="bg-[var(--color-secondary-container)] p-7 rounded-2xl min-w-0 min-h-[180px] flex flex-col justify-between shadow-sm">
            <div className="min-w-0">
              <span className="block text-[var(--color-on-secondary-container)] font-semibold text-[11px] uppercase tracking-widest truncate">
                Suspended Today
              </span>
              <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-black text-[var(--color-on-secondary-container)] leading-none tracking-tight truncate">
                {overdueData?.suspendedCustomers ?? '—'}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[var(--color-on-secondary-container)] min-w-0">
              <span className="material-symbols-outlined text-sm shrink-0">block</span>
              <span className="text-sm font-medium truncate">Auto-suspension active</span>
            </div>
          </div>

        </section>

        {/* ── Main Content Row ─────────────────────────────────────────── */}
        <section className="grid grid-cols-12 gap-7 mb-8">

          {/* Revenue Trend Chart */}
          <div className="col-span-12 lg:col-span-8 min-w-0">
            <RevenueTrendChart data={annData} />
          </div>

          {/* Critical Alerts */}
          <div className="col-span-12 lg:col-span-4 min-w-0 bg-[var(--color-surface-container-high)] rounded-2xl p-7 overflow-hidden relative flex flex-col">
            <h2 className="text-lg font-bold text-[var(--color-primary)] mb-5 shrink-0">Critical Alerts</h2>

            <div className="flex flex-col gap-3 min-w-0">
              <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl flex gap-3 border-l-4 border-[var(--color-error)] min-w-0">
                <div className="w-9 h-9 rounded-full bg-[var(--color-error-container)] flex items-center justify-center text-[var(--color-error)] shrink-0">
                  <span className="material-symbols-outlined text-sm">priority_high</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">12 Accounts Overdue</p>
                  <p className="text-xs text-[var(--color-outline)] mt-0.5">Pending total: $4,230.00</p>
                </div>
              </div>

              <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl flex gap-3 border-l-4 border-[var(--color-secondary)] min-w-0">
                <div className="w-9 h-9 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-on-secondary-container)] shrink-0">
                  <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">Suspension Warning</p>
                  <p className="text-xs text-[var(--color-outline)] mt-0.5">45 accounts approaching limit</p>
                </div>
              </div>

              <div className="bg-[var(--color-primary)] p-4 rounded-xl flex gap-3 border-l-4 border-[var(--color-on-primary-container)] min-w-0">
                <div className="w-9 h-9 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] shrink-0">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--color-on-primary-container)] truncate">Tax Deadline Approaching</p>
                  <p className="text-xs text-white/70 mt-0.5">Q3 Fiscal reports due in 4 days</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </section>

        {/* ── Bottom Row ───────────────────────────────────────────────── */}
        <section className="grid grid-cols-12 gap-7">

          {/* Regional Performance */}
          <div className="col-span-12 lg:col-span-4 min-w-0">
            <RegionalPerformance regions={regData} />
          </div>

          {/* Recent Activity */}
          <div className="col-span-12 lg:col-span-5 min-w-0 bg-[var(--color-surface-container-lowest)] rounded-2xl p-7 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-[var(--color-primary)]">Recent Activity</h2>
              <Link href="/payments">
                <button className="text-xs font-bold text-[var(--color-primary)] hover:underline shrink-0">
                  View All
                </button>
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              {recentPayments.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-outline)]">
                  No recent activities recorded.
                </div>
              ) : (
                recentPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                        <span className="material-symbols-outlined text-sm">
                          {payment.status === 'paid' ? 'credit_card' : 'pending'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">Payment: {payment.customer?.fullName}</p>
                        <p className="text-xs text-[var(--color-outline)]">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Scheduled'}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-black shrink-0",
                      payment.status === 'paid' ? "text-[var(--color-on-secondary-container)]" : "text-[var(--color-error)]"
                    )}>
                      {payment.status === 'paid' ? "+" : ""}{fCurrency(payment.receivedAmount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fiscal Reminders */}
          <div className="col-span-12 lg:col-span-3 min-w-0 bg-[var(--color-secondary-container)] rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 min-w-0">
              <h2 className="text-lg font-bold text-[var(--color-on-secondary-container)] mb-2">Fiscal Reminders</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Ensure compliance for the current billing cycle by updating regional tax tables.
              </p>
            </div>

            <div className="mt-6 relative z-10">
              <Link href="/finance">
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-bold shadow-sm transition-colors text-sm">
                  Update Tax Tables
                </button>
              </Link>
            </div>

            <div
              className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.5), transparent 60%)' }}
            />
          </div>

        </section>

      </div>
    </div>
  );
}
