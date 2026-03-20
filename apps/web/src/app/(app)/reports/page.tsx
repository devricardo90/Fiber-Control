'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/layout/auth-provider';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export default function ReportsPage() {
  const { token } = useAuth();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // 1. Monthly Revenue Data
  const { data: revRes } = useQuery({
    queryKey: ['reports-revenue', currentMonth],
    queryFn: () => apiRequest<any>(`/reports/monthly-revenue?referenceMonth=${currentMonth}`),
    enabled: !!token,
  });

  // 2. Regional Distribution
  const { data: regRes } = useQuery({
    queryKey: ['reports-regions', currentMonth],
    queryFn: () => apiRequest<any>(`/reports/regions?referenceMonth=${currentMonth}`),
    enabled: !!token,
  });

  // 3. Tax Estimates for Financial Summary
  const { data: taxRes } = useQuery({
    queryKey: ['tax-estimate', currentMonth],
    queryFn: () => apiRequest<any>(`/tax-config/estimate?referenceMonth=${currentMonth}`),
    enabled: !!token,
  });

  const revenue = revRes?.data?.summary || { totalPayments: 0, expectedAmount: 0, receivedAmount: 0 };
  const regions = regRes?.data?.regions || [];
  const tax = taxRes?.data || { estimatedTaxThisMonth: 0 };
  
  const netIncome = Math.max(0, revenue.receivedAmount - tax.estimatedTaxThisMonth);

  // Take top 3 regions for the Donut Chart
  const topRegions = [...regions].sort((a, b) => b.receivedAmount - a.receivedAmount).slice(0, 3);
  const totalRegRevenue = topRegions.reduce((acc, curr) => acc + curr.receivedAmount, 0) || 1;

  return (
    <div className="bg-transparent text-[var(--color-on-surface)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Content Area */}
      <div className="px-8 pb-20 max-w-7xl mx-auto">

      {/* Content Area */}
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline text-5xl font-black text-[var(--color-primary)] tracking-tight mb-2">Reports</h1>
            <p className="text-[var(--color-outline)] font-medium">Detailed intelligence and performance metrics for our operation.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[var(--color-surface-container-low)] px-4 py-2.5 rounded-full text-sm font-semibold text-[var(--color-on-surface-variant)] gap-2 hover:bg-[var(--color-surface-container-high)] cursor-pointer">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              Last 30 Days
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
            <button className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90">
              <span className="material-symbols-outlined text-sm">ios_share</span>
              Export
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Monthly Business Report */}
          <div className="col-span-12 lg:col-span-7 bg-[var(--color-surface-container-lowest)] rounded-lg p-8 shadow-sm group relative overflow-hidden border border-[var(--color-outline-variant)]/10">
            <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-secondary)]"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline)] mb-1 block">Operational Pillar</span>
                <h2 className="font-headline text-3xl font-bold text-[var(--color-primary)]">Monthly Business Report</h2>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
            </div>
            
            <div className="flex gap-12 mb-10">
              <div>
                <p className="text-[var(--color-outline)] text-sm font-medium mb-1">Total Revenue</p>
                <p className="font-headline text-4xl font-black text-white">{formatCurrency(revenue.receivedAmount)}</p>
              </div>
              <div className="h-16 w-px bg-[var(--color-surface-container-high)]"></div>
              <div>
                <p className="text-[var(--color-outline)] text-sm font-medium mb-1">Expected intake</p>
                <p className="font-headline text-4xl font-black text-white">{formatCurrency(revenue.expectedAmount)}</p>
              </div>
            </div>

            {/* Simple Bar Visualization */}
            <div className="mb-8">
              <div className="w-full h-24 flex items-end gap-1.5 opacity-80">
                {[40, 60, 35, 75, 90, 55, 45].map((h, i) => (
                   <div 
                    key={i} 
                    className={`w-full rounded-t-md transition-all ${i === 4 ? 'bg-[#2a4d8a]' : i === 5 ? 'bg-[#6b9d7a]' : 'bg-slate-700 group-hover:bg-slate-600'}`}
                    style={{ height: `${h}%` }}
                   />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-[var(--color-secondary)] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">analytics</span>
                Live system monitoring
              </p>
              <button className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm hover:translate-x-1 transition-transform">
                View Full Report
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Customer Growth (Mocked for UI fidelity) */}
          <div className="col-span-12 lg:col-span-5 bg-[var(--color-surface-container-lowest)] rounded-lg p-8 shadow-sm border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline)] mb-1 block">Lifecycle metrics</span>
                <h2 className="font-headline text-3xl font-bold text-[var(--color-primary)]">Customer Growth</h2>
              </div>
              <span className="material-symbols-outlined text-[var(--color-secondary)] text-2xl">person_add</span>
            </div>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-[var(--color-outline)]">Active Base</p>
                  <p className="text-3xl font-bold text-white">{revenue.totalPayments}</p>
                </div>
                <div className="w-32 h-8">
                  <svg className="w-full h-full text-[var(--color-secondary)]" viewBox="0 0 100 20">
                    <path d="M0 15 Q 25 18, 50 10 T 100 2" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-[var(--color-outline)]">Churn Projection</p>
                  <p className="text-3xl font-bold text-white">1.2%</p>
                </div>
              <div className="w-32 h-8">
                  <svg className="w-full h-full text-[#c27070]" viewBox="0 0 100 20">
                    <path d="M0 5 Q 50 5, 100 8" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700">
              Update Projections
            </button>
          </div>

          {/* Financial Summary */}
          <div className="col-span-12 lg:col-span-6 bg-[var(--color-surface-container-lowest)] rounded-lg p-8 shadow-sm border border-[var(--color-outline-variant)]/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--color-primary)]">account_balance_wallet</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-[var(--color-primary)]">Financial Summary</h2>
                <p className="text-sm text-[var(--color-outline)] font-medium">Income vs Liabilities</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-slate-800/40 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Net Income</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(netIncome)}</p>
                <div className="mt-3 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-secondary)] h-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="p-6 bg-slate-800/40 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-[#c27070]/80 uppercase mb-2">Estimated Tax</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(tax.estimatedTaxThisMonth)}</p>
                <div className="mt-3 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-[#c27070] h-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm hover:underline">
              Download Full Spreadsheet
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>

          {/* Regional Distribution (Donut Chart) */}
          <div className="col-span-12 lg:col-span-6 bg-[var(--color-surface-container-lowest)] rounded-lg p-8 shadow-sm border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-2xl font-bold text-[var(--color-primary)]">Regional Presence</h2>
              <span className="text-[10px] font-bold text-[var(--color-on-secondary-container)] bg-[var(--color-secondary-container)] px-3 py-1 rounded-full uppercase italic">Top Performing</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
                  <circle className="stroke-[#2a4d8a]" cx="18" cy="18" fill="none" r="16" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="3" />
                  <circle className="stroke-[#6b9d7a]" cx="18" cy="18" fill="none" r="16" strokeDasharray="25, 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="3" />
                  <circle className="stroke-slate-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="15, 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{regions.length}</span>
                  <span className="text-[10px] font-bold text-[var(--color-outline)] uppercase">Hubs</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {topRegions.map((reg, idx) => {
                   const perc = Math.round((reg.receivedAmount / totalRegRevenue) * 100);
                   const colors = ['bg-[#2a4d8a]', 'bg-[#6b9d7a]', 'bg-slate-500'];
                   return (
                     <div key={reg.regionId} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className={`w-2.5 h-2.5 rounded-full ${colors[idx]}`}></div>
                        <span className="text-sm font-medium text-slate-300">{reg.regionName}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{perc}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800">
               <button className="w-full py-3 text-[var(--color-primary)] font-bold text-sm border-2 border-indigo-500/10 rounded-xl hover:bg-slate-800 transition-all">
                  Deep Geographic Analysis
               </button>
            </div>
          </div>
          
        </div>

        {/* System Footer */}
        <footer className="mt-16 flex justify-center">
          <p className="text-xs text-[var(--color-outline)] flex items-center gap-2 font-medium opacity-60">
            <span className="material-symbols-outlined text-sm">lock</span>
            System data encrypted. Financial reports generated on {new Date().toLocaleDateString()}.
          </p>
        </footer>
      </div>
    </div>
  );
}
