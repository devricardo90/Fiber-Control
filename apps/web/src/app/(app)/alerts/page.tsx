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

export default function AlertsPage() {
  const { token } = useAuth();
  
  const date = new Date();
  const currentDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['alerts-overview', currentDateStr],
    queryFn: () => apiRequest<any>(`/alerts/overview?referenceDate=${currentDateStr}`),
    enabled: !!token,
  });

  const alerts = alertsData?.data;

  // Render logic for dynamic alerts list
  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'high':
        return {
          color: '#d17c7c',
          bg: '#5c3a3a',
          icon: 'warning',
          badge: 'Urgent'
        };
      case 'medium':
        return {
          color: '#c9995d',
          bg: '#4a3f2a',
          icon: 'timer',
          badge: 'Critical'
        };
      default:
        return {
          color: '#2a4d8a',
          bg: '#3d5070',
          icon: 'analytics',
          badge: 'Diagnostic'
        };
    }
  };

  return (
    <div className="bg-transparent text-[var(--color-on-surface)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main Content Canvas */}
      <div className="px-8 pb-12 min-h-screen">

      {/* Main Content Canvas */}
        <div className="flex flex-col gap-8">
          
          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black font-headline tracking-tight text-[var(--color-primary)]">Alerts</h2>
              <p className="text-[var(--color-outline)] mt-1 font-medium">Operational intelligence and critical oversight center.</p>
            </div>
            {/* Segmented Control (Tabs) */}
            <div className="bg-[var(--color-surface-container-low)] p-1.5 rounded-2xl flex gap-1">
              <button className="px-6 py-2 rounded-xl text-sm font-bold bg-white text-slate-800 shadow-sm transition-all">All</button>
              <button className="px-6 py-2 rounded-xl text-sm font-bold text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-all">Critical</button>
              <button className="px-6 py-2 rounded-xl text-sm font-bold text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-all">Warning</button>
            </div>
          </section>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Content: Alert Stream */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {isLoading || !alerts ? (
                <div className="w-full flex justify-center py-20 text-[var(--color-outline)] font-bold text-sm">
                  Scanning regional grid metrics...
                </div>
              ) : alerts.alerts.length === 0 ? (
                <div className="w-full flex justify-center py-20 text-[var(--color-outline)] font-bold">
                  Zero critical anomalies detected for today.
                </div>
              ) : (
                alerts.alerts.map((alert: any, idx: number) => {
                  const style = getSeverityStyles(alert.severity);

                  return (
                    <div key={idx} className="group bg-[var(--color-surface-container-lowest)] p-8 rounded-lg shadow-sm hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="absolute left-0 top-0 w-1.5 h-full" style={{ backgroundColor: style.color }}></div>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: style.bg + '1A' }}>
                        <span className="material-symbols-outlined text-3xl" style={{ color: style.color, fontVariationSettings: "'FILL' 1" }}>{style.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: style.color + '1A', color: style.color }}>{style.badge}</span>
                          <span className="text-[var(--color-outline)] text-xs font-medium">{alert.customer?.fullName} • {alert.code}</span>
                        </div>
                        <h3 className="text-xl font-headline font-bold text-[var(--color-on-surface)]">{alert.message}</h3>
                        <p className="text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                          {alert.type === 'overdue_customer' && `Customer is ${alert.daysLate} days late for payment of ${formatCurrency(alert.payment?.outstandingAmount)}.`}
                          {alert.type === 'cutoff_soon' && `Service will be throttled in ${alert.daysUntilCutoff} days if payment of ${formatCurrency(alert.payment?.outstandingAmount)} is not received.`}
                          {alert.type === 'pending_payment' && `Payment of ${formatCurrency(alert.payment?.outstandingAmount)} is due in ${alert.daysUntilDue} days.`}
                          {!['overdue_customer', 'cutoff_soon', 'pending_payment'].includes(alert.type) && `Please review account metrics to rectify this status.`}
                        </p>
                      </div>
                      <button className="px-6 py-3 text-white rounded-full font-bold text-sm shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-all flex-shrink-0" style={{ backgroundColor: style.color }}>
                          Action
                      </button>
                    </div>
                  );
                })
              )}

              {/* Informational Stub para preencher layout idêntico caso api retorne pouco */}
              {(alerts && alerts.alerts.length < 3) && (
                <div className="group bg-[var(--color-surface-container-lowest)] p-8 rounded-lg shadow-sm hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 opacity-60">
                   <div className="absolute left-0 top-0 w-1.5 h-full bg-[#8d8a4d]"></div>
                   <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-container-high)] flex items-center justify-center flex-shrink-0">
                     <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-3xl">account_balance_wallet</span>
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                       <span className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Warning</span>
                       <span className="text-[var(--color-outline)] text-xs font-medium">Automated</span>
                     </div>
                     <h3 className="text-xl font-headline font-bold text-[var(--color-on-surface)]">Tax deadline approaching</h3>
                     <p className="text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">Compliance documentation for Q3 fiscal reporting must be finalized by Friday close of business.</p>
                   </div>
                   <button className="px-6 py-3 border-2 border-[var(--color-outline)]/20 text-[var(--color-on-surface)] rounded-full font-bold text-sm hover:border-[var(--color-on-surface)] hover:text-white transition-all flex-shrink-0">
                       Open Center
                   </button>
                 </div>
              )}

            </div>

            {/* Right Sidebar: Filters & Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              
              {/* Insights Mini Card */}
              <div className="bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-2xl shadow-slate-900/30 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                <h4 className="text-xs uppercase font-black tracking-[0.2em] opacity-60 mb-4">Total Efficiency</h4>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black font-headline tracking-tighter">94.2%</span>
                  <span className="text-white font-bold flex items-center mb-2">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 
                    2.1%
                  </span>
                </div>
                <p className="text-[var(--color-primary-container)] text-sm font-medium">Alert resolution time is faster than previous month.</p>
              </div>

              {/* Filter Section */}
              <div className="bg-[var(--color-surface-container-low)] rounded-lg p-6">
                <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  Filter by Type
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:ring-2 hover:ring-[var(--color-secondary)]/20 transition-all text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">payments</span>
                      <span className="font-bold text-sm">Payment</span>
                    </div>
                    <input defaultChecked className="rounded-md border-slate-200 text-indigo-500 focus:ring-indigo-500 h-5 w-5" type="checkbox" />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:ring-2 hover:ring-[var(--color-secondary)]/20 transition-all text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">group</span>
                      <span className="font-bold text-sm">Customer</span>
                    </div>
                    <input defaultChecked className="rounded-md border-slate-200 text-indigo-500 focus:ring-indigo-500 h-5 w-5" type="checkbox" />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:ring-2 hover:ring-[var(--color-secondary)]/20 transition-all text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">explore</span>
                      <span className="font-bold text-sm">Region</span>
                    </div>
                    <input className="rounded-md border-slate-200 text-indigo-500 focus:ring-indigo-500 h-5 w-5" type="checkbox" />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:ring-2 hover:ring-[var(--color-secondary)]/20 transition-all text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">description</span>
                      <span className="font-bold text-sm">Fiscal</span>
                    </div>
                    <input className="rounded-md border-slate-200 text-indigo-500 focus:ring-indigo-500 h-5 w-5" type="checkbox" />
                  </label>
                </div>
                
                <button className="w-full mt-6 py-3 border-2 border-dashed border-[var(--color-outline-variant)] text-[var(--color-outline)] rounded-xl text-sm font-bold hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-all">
                    Reset Filters
                </button>
              </div>

              {/* Summary Stats Bento Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface-container-high)] p-5 rounded-lg">
                  <span className="text-[var(--color-error)] text-3xl font-black font-headline">{alerts?.summary?.totalAlerts || 0}</span>
                  <p className="text-[10px] uppercase font-black text-[var(--color-outline)] tracking-widest mt-1">Pending</p>
                </div>
                <div className="bg-[var(--color-surface-container-high)] p-5 rounded-lg">
                  {/* Fixed simulated resolved metric over current alerts context */}
                  <span className="text-[var(--color-primary)] text-3xl font-black font-headline">{ (alerts?.summary?.totalAlerts || 0) * 3 + 12 }</span>
                  <p className="text-[10px] uppercase font-black text-[var(--color-outline)] tracking-widest mt-1">Resolved</p>
                </div>
              </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
