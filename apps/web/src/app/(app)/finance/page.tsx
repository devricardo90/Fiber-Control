'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/layout/auth-provider';
import { ExpectedVsReceivedChart } from '@/features/finance/components/expected-vs-received-chart';
import { IncomeTrendChart } from '@/features/finance/components/income-trend-chart';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export default function FinancePage() {
  const { token } = useAuth();
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonthNum = date.getMonth() + 1;
  const currentMonthStr = String(currentMonthNum).padStart(2, '0');
  const referenceMonth = `${currentYear}-${currentMonthStr}`;

  // 1. Overview KPIs
  const { data: finData } = useQuery({
    queryKey: ['finance-overview', referenceMonth],
    queryFn: () => apiRequest<any>(`/finance/overview?referenceMonth=${referenceMonth}`),
    enabled: !!token,
  });

  // 2. Reconciliation Status and Table
  const { data: recData } = useQuery({
    queryKey: ['reconciliation-overview', referenceMonth],
    queryFn: () => apiRequest<any>(`/reconciliation/overview?referenceMonth=${referenceMonth}`),
    enabled: !!token,
  });

  // 3. Trends and Bar charts
  const { data: annData } = useQuery({
    queryKey: ['annual-summary', currentYear],
    queryFn: () => apiRequest<any>(`/reports/annual-summary?year=${currentYear}`),
    enabled: !!token,
  });

  const finance = finData?.data;
  const recon = recData?.data;
  const annual = annData?.data;

  // Sync Percent Math
  const matchCount = recon?.summary?.matchedEntries || 0;
  const unmatchCount = recon?.summary?.unmatchedEntries || 0;
  const totalEntries = matchCount + unmatchCount;
  const syncPercent = totalEntries > 0 ? Math.round((matchCount / totalEntries) * 100) : 0;

  // YoY % (Year over year) 
  const yoyVal = finance?.totalReceivedLastYear 
                 ? ((finance.totalReceivedThisYear / finance.totalReceivedLastYear) - 1) * 100
                 : null;

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] antialiased relative min-h-screen selection:bg-[var(--color-primary-container)] selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* SideNavBar Shell */}
      <aside className="flex flex-col h-full py-6 bg-slate-900 border-r-0 fixed left-0 top-0 w-64 z-50">
        <div className="px-8 mb-10">
          <span className="text-2xl font-black tracking-tight text-indigo-300">FiberControl</span>
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
          {/* Finance Active */}
          <div className="flex items-center gap-3 px-4 py-3 text-lime-400 font-bold bg-slate-800 rounded-l-full ml-4 shadow-sm">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="text-sm">Finance</span>
          </div>
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
          <button className="w-full py-4 px-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-98 active:opacity-80">
            <span className="material-symbols-outlined text-xl">help</span> Support
          </button>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-slate-900/80 backdrop-blur-xl flex justify-between items-center h-20 px-8 ml-64 shadow-sm shadow-indigo-900/5">
        <div className="flex items-center gap-4 w-96">
           <div className="relative w-full group">
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)]">search</span>
             <input type="text" className="w-full bg-[var(--color-surface-container-highest)] border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-sm text-white" placeholder="Search transactions..." />
           </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-[#414753] pr-6">
               <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-all">
                 <span className="material-symbols-outlined">notifications</span>
               </button>
               <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-all">
                  <span className="material-symbols-outlined">account_circle</span>
               </button>
            </div>
            <button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-900/20 hover:scale-105 transition-all">
                Add Customer
            </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-28 px-10 pb-12 min-h-screen">
        
        {/* Header Section */}
        <header className="mb-12">
          <h2 className="text-4xl font-black tracking-tight text-[var(--color-primary)] mb-2">Finance Overview</h2>
          <p className="text-[var(--color-outline)] font-medium">Fiscal Year {currentYear} • Q{(Math.floor((currentMonthNum - 1) / 3) + 1)} Diagnostic Report</p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-6">
              {/* KPI Card 1 */}
              <div className="col-span-1 bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border-l-4 border-[var(--color-primary)] flex flex-col justify-between h-[150px]">
                <div>
                  <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-widest mb-2">Received</p>
                  <h3 className="text-2xl font-bold text-[var(--color-on-surface)]">
                    {finance ? formatCurrency(finance.totalReceivedThisMonth) : '...'}
                  </h3>
                </div>
                <div className="mt-4 h-1 bg-[var(--color-surface-container-high)] rounded-full overflow-hidden w-full">
                  <div className="h-full bg-[var(--color-primary)] w-[90%]"></div>
                </div>
              </div>

              {/* KPI Card 2 */}
              <div className="col-span-1 bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-[150px]">
                <div>
                  <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-widest mb-2">Expected</p>
                  <h3 className="text-2xl font-bold text-[var(--color-on-surface)]">
                    {finance ? formatCurrency(finance.expectedRevenueThisMonth) : '...'}
                  </h3>
                </div>
                <p className={`text-xs font-bold mt-2 ${yoyVal && yoyVal >= 0 ? 'text-[var(--color-secondary)]' : 'text-[var(--color-error)]'}`}>
                  {yoyVal !== null ? `${yoyVal > 0 ? '+' : ''}${yoyVal.toFixed(1)}% vs LY` : '...'}
                </p>
              </div>

              {/* KPI Card 3 */}
              <div className="col-span-1 bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-[150px]">
                <div>
                  <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-widest mb-2">Overdue</p>
                  <h3 className="text-2xl font-bold text-[var(--color-error)]">
                    {finance ? formatCurrency(finance.overdueAmount) : '...'}
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-outline)] mt-2">Unresolved pending invoices</p>
              </div>

              {/* KPI Card 4 */}
              <div className="col-span-1 bg-[var(--color-secondary-container)] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-[150px]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-[var(--color-on-secondary-container)] uppercase tracking-widest">Est. Tax</p>
                    <span className="material-symbols-outlined text-[var(--color-on-secondary-container)] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-on-secondary-container)]">$1,200</h3>
                </div>
                <p className="text-[10px] font-bold text-[var(--color-on-secondary-container)] opacity-60 mt-2">AMBER ALERT: LOW RESERVE</p>
              </div>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-2 gap-8">
              {/* Expected vs Received */}
              <div className="bg-[var(--color-surface-container-lowest)] p-8 pt-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-[var(--color-on-surface)]">Expected vs Received</h4>
                  <span className="material-symbols-outlined text-[var(--color-outline)]">more_vert</span>
                </div>
                
                <ExpectedVsReceivedChart data={annual} />

                <div className="mt-4 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>
                    <span className="text-xs font-medium text-[var(--color-outline)]">Expected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-secondary)]"></div>
                    <span className="text-xs font-medium text-[var(--color-outline)]">Received</span>
                  </div>
                </div>
              </div>

              {/* Yearly Income Trend */}
              <div className="bg-[var(--color-surface-container-lowest)] p-8 pt-6 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-[var(--color-on-surface)]">Income Trend</h4>
                  <select className="bg-[var(--color-surface-container)] text-xs border-none rounded-full px-3 py-1 font-bold outline-none ring-0 text-white cursor-pointer">
                    <option>{currentYear} vs {currentYear - 1}</option>
                  </select>
                </div>
                
                <IncomeTrendChart 
                  currentYearRevenue={finance?.totalReceivedThisYear || 0} 
                  lastYearRevenue={finance?.totalReceivedLastYear || 0} 
                />

                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[var(--color-primary)]"></div>
                    <span className="text-xs font-medium text-[var(--color-outline)]">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-[var(--color-surface-container-highest)] border-dashed border-t-2 border-[var(--color-outline)]"></div>
                    <span className="text-xs font-medium text-[var(--color-outline)]">Previous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unmatched Entries Quick List */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-[var(--color-surface-container-high)] flex justify-between items-center">
                <h4 className="text-lg font-bold text-[var(--color-on-surface)]">Unmatched Entries</h4>
                <span className="bg-[var(--color-error-container)] text-[var(--color-error)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Needs Attention</span>
              </div>
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-container-low)]">
                      <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-widest">Transaction</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-widest text-right">Amount</th>
                      <th className="px-8 py-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-surface-container-high)]">
                    {(!recon?.unmatchedEntries || recon.unmatchedEntries.length === 0) && (
                       <tr>
                         <td colSpan={4} className="px-8 py-6 text-center text-[var(--color-outline)] text-sm">
                           No unmatched entries pending at this time.
                         </td>
                       </tr>
                    )}
                    {recon?.unmatchedEntries?.slice(0, 5).map((entry: any, i: number) => (
                      <tr key={entry.id} className={`hover:bg-[var(--color-surface-bright)] transition-colors ${i % 2 !== 0 ? 'bg-[var(--color-surface-container-low)]/30' : ''}`}>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm">{entry.source === 'stripe' ? 'credit_card' : 'account_balance_wallet'}</span>
                            </div>
                            <span className="font-semibold text-sm max-w-[200px] truncate" title={entry.description || "Unknown origin"}>
                               {entry.description || "Unknown origin"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm text-[var(--color-outline)]">
                           {new Date(entry.occurredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-right text-[var(--color-on-surface)]">
                          {formatCurrency(entry.amount)}
                        </td>
                        <td className="px-8 py-4 text-center">
                          <button className="text-[var(--color-primary)] font-bold text-xs hover:underline">Match</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

          {/* Right Panel (Sidebar/Widgets) */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Tax & Fiscal Summary */}
            <div className="bg-[var(--color-primary)] text-white p-8 rounded-2xl shadow-xl shadow-indigo-900/10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <h4 className="text-xl font-bold">Tax &amp; Fiscal</h4>
                  <span className="material-symbols-outlined bg-white/10 p-2 rounded-lg">receipt_long</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Next Deadline</p>
                    <p className="text-2xl font-extrabold text-[var(--color-primary-container)]">Oct 25, {currentYear}</p>
                    <p className="text-xs mt-1 text-white/80">Quarterly VAT Filing</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Current Regime</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-[var(--color-secondary)] text-[var(--color-on-secondary-fixed)] px-2 py-0.5 rounded text-[10px] font-black">STANDARD</span>
                      <span className="text-sm font-medium">Corporate High-Growth</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-secondary)] rounded-full blur-[80px] opacity-20"></div>
            </div>

            {/* Bank Reconciliation */}
            <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm">
              <h4 className="text-lg font-bold text-[var(--color-on-surface)] mb-6">Reconciliation</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[var(--color-outline)]">Matched Status</span>
                <span className="text-sm font-black text-[var(--color-secondary)]">{syncPercent}%</span>
              </div>
              <div className="w-full h-3 bg-[var(--color-surface-container-high)] rounded-full mb-8">
                <div className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-700 ease-out" style={{ width: `${syncPercent}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface-container-low)] p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{matchCount}</p>
                  <p className="text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-wider">Synced</p>
                </div>
                <div className="bg-[var(--color-surface-container-low)] p-4 rounded-xl text-center border-2 border-transparent hover:border-[var(--color-error)] transition-all cursor-pointer">
                  <p className="text-2xl font-bold text-[var(--color-error)]">{unmatchCount}</p>
                  <p className="text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-wider">Unmatched</p>
                </div>
              </div>
              <button className="w-full mt-8 py-3 bg-[var(--color-surface-container-highest)] text-white hover:text-white font-bold rounded-full text-sm hover:bg-[var(--color-primary-container)] hover:text-slate-900 transition-all">
                  Run Auto-Sync
              </button>
            </div>

            {/* Revenue Drop Warning */}
            <div className="bg-[var(--color-error-container)]/10 border-2 border-[var(--color-error)]/20 p-6 rounded-2xl">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-[var(--color-error)]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                </div>
                <div>
                  <h5 className="font-bold text-[var(--color-error)] text-sm mb-1">Revenue Anomaly Detected</h5>
                  <p className="text-xs text-[var(--color-error)]/80 mt-1 leading-relaxed">Incoming payments are 15% lower than the trailing 3-month average. Check 'Overdue' to recover liquidity.</p>
                  <button className="mt-4 text-xs font-bold text-[var(--color-error)] flex items-center gap-1 group">
                      View Analysis
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
