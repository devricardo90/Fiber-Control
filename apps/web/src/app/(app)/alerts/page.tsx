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
          color: 'var(--color-error)',
          bg: 'var(--color-error-container)',
          icon: 'warning',
          badge: 'Urgent'
        };
      case 'medium':
        return {
          color: 'var(--color-secondary)',
          bg: 'var(--color-secondary-container)',
          icon: 'timer',
          badge: 'Critical'
        };
      default:
        return {
          color: 'var(--color-primary)',
          bg: 'var(--color-primary-container)',
          icon: 'analytics',
          badge: 'Diagnostic'
        };
    }
  };

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
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-sm">Payments</span>
          </a>
          <a href="/finance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="text-sm">Finance</span>
          </a>
          {/* Active State: Alerts */}
          <div className="flex items-center gap-3 px-4 py-3 text-lime-400 font-bold bg-slate-800 rounded-l-full ml-4 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
            <span className="text-sm">Alerts</span>
          </div>
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
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)]">search</span>
            <input className="w-full bg-[var(--color-surface-container-highest)] text-white border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-secondary)] text-sm outline-none" placeholder="Search alerts or entities..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
            <span className="material-symbols-outlined text-xl">person_add</span>
            Add Customer
          </button>
          <div className="flex items-center gap-4 border-l border-[#414753] pl-6">
            <button className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 rounded-full object-cover ring-2 ring-white" alt="Corporate professional user profile portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkMn8P3YLL_3NsF68kl00Tt1APzPLT4cgsWDi4CqYHEQrtxqIMIeXE3WFL9zrt5vnjSrgUtqPuMvqe5jqVElGl9AGtXBMQdcfSOO9X-SlaiSO3PlCfTBadiCBABBzrq5kBs3D2sX0M0UPxUxBL6RdXstCHruciI1lOyYra-xYNS5-oCs8wUTmzVY0rxPDAeg58z-ghz9tKeSYsybXWW68Hfaalt4faGPcV4mLv7AtFchCTUr3RkDAXNScreJdnp_2brfcRSgun-lg" />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold leading-tight">Marcus Reed</p>
                <p className="text-[10px] text-[var(--color-outline)] uppercase font-bold tracking-tighter">System Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-28 px-10 pb-12 min-h-screen">
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
                   <div className="absolute left-0 top-0 w-1.5 h-full bg-[#dfec60]"></div>
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
              <div className="bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
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
      </main>

      {/* Contextual FAB - Alert Center Intent */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_alert</span>
      </button>

    </div>
  );
}
