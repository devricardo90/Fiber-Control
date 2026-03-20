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
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6b9d7a]/10 text-[#9fa857]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b9d7a]"></span>Paid
             </span>
          );
       case 'pending':
          return (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c9995d]/10 text-[#d4a574]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9995d]"></span>Pending
             </span>
          );
       case 'partial':
          return (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8b9fc9]/10 text-[#a8b8d8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b9fc9]"></span>Partial
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
    <div className="bg-transparent text-[var(--color-on-surface)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main Content Canvas */}
      <div className="px-8 pb-32 min-h-screen">
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8">
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
        </div>

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
                <span className="text-xs font-bold text-[#6b9d7a] flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  Live
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-outline)] mb-1">Total Pending</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#b8895a]">
                   {formatCurrency(totalPendingAmount)}
                </span>
                <span className="text-xs font-bold text-[#b8895a] flex items-center">
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
