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

export default function PaymentsPage() {
  const { token } = useAuth();

  const { data: paymentsRes, isLoading } = useQuery({
    queryKey: ['payments-list'],
    queryFn: () => apiRequest<any>('/payments'),
    enabled: !!token,
  });

  const payments = paymentsRes?.data || [];

  // Local Aggregation logic for Sticky Summary Bar
  const totalPaid = payments
    .filter((p: any) => p.status === 'paid' || p.status === 'partial')
    .reduce((acc: number, cur: any) => acc + (cur.receivedAmount || 0), 0);

  const pendingPayments = payments.filter((p: any) => p.status === 'pending');
  const totalPendingAmount = pendingPayments.reduce((acc: number, cur: any) => acc + (cur.expectedAmount || 0), 0);

  const failedPayments = payments.filter((p: any) => p.status === 'failed');
  const totalFailedAmount = failedPayments.reduce((acc: number, cur: any) => acc + (cur.expectedAmount || 0), 0);

  // Status mapping
  const getStatusChip = (status: string) => {
    switch(status) {
       case 'paid':
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid
            </span>
         );
       case 'pending':
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending
            </span>
         );
       case 'partial':
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Partial
            </span>
         );
       case 'failed':
       default:
         return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-error)]/10 text-[var(--color-error)]">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]"></span>Failed
            </span>
         );
    }
  }

  // Generate deterministic avatars (seeded by ID)
  const getAvatar = (id: string, name: string) => {
    const idx = parseInt(id.replace(/\D/g, '').substring(0, 1)) || 0;
    const colors = ['bg-indigo-900', 'bg-blue-900', 'bg-emerald-900', 'bg-amber-900', 'bg-red-900'];
    const color = colors[idx % colors.length];
    
    return (
      <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center overflow-hidden`}>
         <span className="text-white font-bold text-sm tracking-widest">{name.substring(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] antialiased relative min-h-screen selection:bg-[var(--color-primary-container)] selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* SideNavBar Shell */}
      <aside className="flex flex-col h-full py-6 bg-slate-900 border-r-0 fixed left-0 top-0 w-64 z-50">
        <div className="px-8 mb-10">
          <span className="text-2xl font-black tracking-tight text-indigo-300 font-headline">FiberControl</span>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-outline)] font-bold mt-1">SaaS Platform</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm">Customers</span>
          </a>
          {/* Active State: Payments */}
          <div className="flex items-center gap-3 px-4 py-3 text-lime-400 font-bold bg-slate-800 rounded-l-full ml-4 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <span className="text-sm">Payments</span>
          </div>
          <a href="/finance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="text-sm">Finance</span>
          </a>
          <a href="/alerts" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="text-sm">Alerts</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">map</span>
            <span className="text-sm">Regions</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">route</span>
            <span className="text-sm">Routes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm">Reports</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">
          <button className="w-full py-4 px-4 rounded-2xl bg-[var(--color-surface-container-high)] text-[var(--color-primary)] font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-surface-container-highest)] transition-all scale-98 active:opacity-80">
            <span className="material-symbols-outlined text-xl">help</span> Support
          </button>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-slate-900/80 backdrop-blur-xl flex justify-between items-center h-20 px-8 ml-64 shadow-sm shadow-indigo-900/5">
        <div className="flex items-center gap-4 w-96">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)]">search</span>
            <input className="w-full bg-[var(--color-surface-container-highest)] text-white border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-secondary)] text-sm outline-none placeholder:text-[var(--color-outline)]" placeholder="Search transactions..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-6 py-2.5 rounded-full font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm">
            <span className="material-symbols-outlined text-xl">add_card</span>
            Register Payment
          </button>
          <div className="flex items-center gap-4 border-l border-[#414753] pl-6">
            <button className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[var(--color-primary-fixed)] overflow-hidden ring-2 ring-white">
                <img className="h-full w-full object-cover" alt="User profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDngzGKVjtTHU8574O_40vf_V7MLXoOAG6pAUwIwKFLQyzdMwlS7DwHsa_rcnbguW7LRliORQtuCHI1fZCwF8d83erqzw1sSKct72QtblpdIYgHhW20WwVEg0M5kzGyzu6nGatI6sIR1PHWCUoNCln8JOlezMN5QGjnU9vUfM1WitTUiZUmKFQVdKBUtA5vQxTKf9gvO5UJkKRVbTY9F9gLiCH8nBmV3EcOM2Wi90DRvoCsZvkV7hr6Ca22VWHVlQD4zbkR-cEybyo" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-28 pb-32 px-12 min-h-screen">
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black font-headline text-[var(--color-primary)] tracking-tight mb-2">Payments</h1>
            <p className="text-[var(--color-on-surface-variant)] font-medium">Manage and reconcile fiber service transactions.</p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface-container-low)] p-1.5 rounded-full">
            <button className="px-6 py-2 rounded-full text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all">Previous</button>
            <button className="px-6 py-2 rounded-full text-sm font-bold bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-md">All Time</button>
            <span className="material-symbols-outlined px-2 text-[var(--color-outline)]">calendar_month</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-2">Status</label>
            <select className="w-full bg-[var(--color-surface-container-lowest)] text-white border-none rounded-2xl py-4 px-4 shadow-sm focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-medium outline-none">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-2">Method</label>
            <select className="w-full bg-[var(--color-surface-container-lowest)] text-white border-none rounded-2xl py-4 px-4 shadow-sm focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-medium outline-none">
              <option>All Methods</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Direct Debit</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-2">Region</label>
            <select className="w-full bg-[var(--color-surface-container-lowest)] text-white border-none rounded-2xl py-4 px-4 shadow-sm focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-medium outline-none">
              <option>All Regions</option>
              <option>North District</option>
              <option>Central Metro</option>
              <option>South Sector</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-4 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] font-bold rounded-2xl hover:bg-[var(--color-surface-container-highest)] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">filter_alt</span>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Payments Table Card */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-lg shadow-sm overflow-hidden min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container-high)]/50 text-[var(--color-outline)] text-[11px] font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Customer</th>
                <th className="px-6 py-5">Ref. Month</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Paid At</th>
                <th className="px-6 py-5">Method</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-container)]">
              {isLoading && (
                 <tr>
                   <td colSpan={7} className="px-8 py-10 text-center text-[var(--color-outline)] text-sm opacity-60">
                     Loading transaction ledger...
                   </td>
                 </tr>
              )}
              
              {!isLoading && payments.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-8 py-10 text-center text-[var(--color-outline)] text-sm opacity-60">
                     No payment history found.
                   </td>
                 </tr>
              )}

              {payments.map((payment: any, idx: number) => (
                <tr key={payment.id} className={`group hover:bg-[var(--color-surface-container-low)] transition-colors ${idx % 2 !== 0 ? 'bg-[var(--color-surface-container-low)]/30' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {getAvatar(payment.customerId, payment.customer?.fullName || 'Unknown')}
                      <div>
                        <p className="font-bold text-[var(--color-on-surface)] truncate max-w-[200px]" title={payment.customer?.fullName}>
                            {payment.customer?.fullName || 'Unknown Customer'}
                        </p>
                        <p className="text-[10px] text-[var(--color-outline)] uppercase">ID: {payment.customerId.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[var(--color-on-surface-variant)]">{payment.referenceMonth}</td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--color-primary)]">
                     {formatCurrency(payment.status === 'pending' || payment.status === 'failed' ? payment.expectedAmount : payment.receivedAmount)}
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--color-on-surface-variant)]">
                     {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : <span className="text-[var(--color-outline)] italic">N/A</span>}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
                      <span className="material-symbols-outlined text-sm">account_balance</span>
                      Bank Transfer
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusChip(payment.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="material-symbols-outlined text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors">more_vert</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Summary Bar (Sticky Bottom) */}
      <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] bg-slate-900/90 backdrop-blur-xl border-t border-[#414753] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-40">
        <div className="px-12 py-6 flex justify-between items-center">
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-outline)] mb-1">Total Paid</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--color-on-surface)]">
                   {formatCurrency(totalPaid)}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  Live
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-outline)] mb-1">Total Pending</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-500">
                   {formatCurrency(totalPendingAmount)}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center">
                  <span className="material-symbols-outlined text-sm">pause</span>
                  {pendingPayments.length} cases
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-outline)] mb-1">Total Failed</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--color-error)]">
                   {formatCurrency(totalFailedAmount)}
                </span>
                <span className="text-xs font-bold text-[var(--color-error)] flex items-center">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  {failedPayments.length} cases
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] font-bold rounded-full hover:bg-[var(--color-surface-container-highest)] transition-all flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
            <button className="px-8 py-3 bg-[var(--color-secondary)] text-[var(--color-on-secondary)] font-bold rounded-full shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm">analytics</span>
              View Full Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
