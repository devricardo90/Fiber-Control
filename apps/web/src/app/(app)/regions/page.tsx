'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/layout/auth-provider';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RegionsPage() {
  const { token } = useAuth();

  const { data: perfRes, isLoading } = useQuery({
    queryKey: ['regions-performance'],
    queryFn: () => apiRequest<any>('/regions/performance'),
    enabled: !!token,
  });

  const regionsData = perfRes?.data?.regions || [];
  
  // Find top performer and attention required based on real data
  const topPerformer = [...regionsData].sort((a, b) => b.receivedAmount - a.receivedAmount)[0];
  const attentionRequired = [...regionsData].sort((a, b) => (b.overdueCustomers / b.customerCount) - (a.overdueCustomers / a.customerCount))[0];

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] antialiased min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-900 flex flex-col py-6 z-50">
        <div className="px-8 mb-10">
          <span className="text-2xl font-black text-indigo-300 tracking-tight font-headline">FiberControl</span>
          <p className="text-[10px] font-semibold text-[var(--color-outline)] tracking-widest uppercase mt-1">SaaS Platform</p>
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
          <a href="/payments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-sm">Payments</span>
          </a>
          <a href="/finance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="text-sm">Finance</span>
          </a>
          <a href="/alerts" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="text-sm">Alerts</span>
          </a>
          <div className="flex items-center gap-3 px-4 py-3 text-lime-400 font-bold bg-slate-800 rounded-l-full ml-4 shadow-sm">
            <span className="material-symbols-outlined">map</span>
            <span className="text-sm text-[var(--color-primary)]">Regions</span>
          </div>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">route</span>
            <span className="text-sm">Routes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm">Reports</span>
          </a>
          <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">
          <button className="w-full py-3 px-4 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-primary)] font-bold transition-all hover:bg-[var(--color-surface-container-highest)]">
            <span className="material-symbols-outlined text-sm inline-block align-middle mr-2">help</span>
            Support
          </button>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-slate-900/80 backdrop-blur-xl flex justify-between items-center h-20 px-8">
        <div className="flex items-center bg-[var(--color-surface-container-low)] px-4 py-2 rounded-full w-96 group focus-within:ring-2 focus-within:ring-[var(--color-secondary)] transition-all">
          <span className="material-symbols-outlined text-[var(--color-outline)]">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[var(--color-outline)] ml-2 text-white outline-none" placeholder="Search regions..." type="text" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-slate-800 pr-6 text-[var(--color-outline)]">
            <button className="hover:text-[var(--color-primary)] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-secondary)] rounded-full"></span>
            </button>
            <button className="hover:text-[var(--color-primary)] transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90">
            <span className="material-symbols-outlined text-sm">add</span> Add Region
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-20 p-8 min-h-screen">
        
        {/* Header Section */}
        <section className="mb-10 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-[var(--color-outline)] text-xs font-semibold uppercase tracking-widest mb-2 font-label">
              <span>Performance</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-[var(--color-primary)]">Regional Strategy</span>
            </nav>
            <h1 className="text-4xl font-black text-[var(--color-primary)] font-headline tracking-tight">Regions</h1>
            <p className="text-[var(--color-on-surface-variant)] mt-1">Strategic oversight of fiber penetration and revenue yield across global sectors.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-[var(--color-surface-container-low)] px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse"></div>
              <span className="text-sm font-bold text-[var(--color-primary)]">Live Operations</span>
            </div>
          </div>
        </section>

        {/* Bento Grid: Map & High-Level Metrics */}
        <section className="grid grid-cols-12 gap-6 mb-12">
          
          {/* Map Card */}
          <div className="col-span-8 bg-[var(--color-surface-container-lowest)] rounded-lg p-6 flex flex-col relative overflow-hidden shadow-sm border border-[var(--color-outline-variant)]/10">
            <div className="flex justify-between items-start mb-6 z-10">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-primary)]">Operating Coverage</h3>
                <p className="text-sm text-[var(--color-outline)]">Active infrastructure footprint by density.</p>
              </div>
              <div className="flex gap-2 bg-[var(--color-surface-container)] p-1 rounded-full">
                <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 shadow-sm">Growth View</button>
                <button className="px-4 py-1.5 rounded-full text-xs font-bold text-[var(--color-outline)] hover:text-white transition-colors">Revenue View</button>
              </div>
            </div>
            {/* Map Placeholder */}
            <div className="w-full h-80 rounded-2xl relative bg-slate-800/50 flex items-center justify-center overflow-hidden">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsObD6akaXFGlmOqi72h8FhWUlUVA-_4yTCXQgy6L8f1al9eY0hiK4PSVFscthE2qbi8ythKiq0xW2wVCK2uphN_vGcsxbiTBN_oG5UZdDwhiw6Bh2FZRO37vMxIHiBihlcm6wgViRmoq2QXY1g9laOi8MDAGXfaC1Gk5Zcu3oS_Qqs2DAKmp2g-gkOEuj3qjetss4CDw-LfEYTXPiavguWjY9kj23a4fs0hTgOGeKGLcmo1FL4BW4K9qHCuACVCFdB17sjM5QDbU" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-150" />
               <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-[var(--color-secondary)] rounded-full shadow-[0_0_20px_var(--color-secondary)] animate-pulse"></div>
               <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[var(--color-secondary)] rounded-full"></div>
               <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-[var(--color-primary)] rounded-full"></div>
               {/* Tooltip */}
               <div className="absolute top-1/2 left-1/2 translate-x-4 -translate-y-12 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl z-20">
                 <p className="text-[10px] font-bold text-[var(--color-outline)] uppercase">Performance Cluster</p>
                 <p className="text-sm font-black text-white">{perfRes?.data?.summary?.totalCustomers.toLocaleString()} Customers</p>
                 <div className="flex items-center gap-1 text-[var(--color-secondary)] mt-1">
                   <span className="material-symbols-outlined text-xs">trending_up</span>
                   <span className="text-[10px] font-bold">System Wide Active</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Performers */}
          <div className="col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-[var(--color-surface-container-lowest)] rounded-lg p-6 relative overflow-hidden border border-[var(--color-outline-variant)]/10 shadow-sm">
              <span className="text-[10px] font-bold text-[var(--color-on-secondary-container)] bg-[var(--color-secondary-container)] px-2 py-1 rounded mb-4 inline-block tracking-wider uppercase">Top Revenue Hub</span>
              <h4 className="text-2xl font-black text-[var(--color-primary)]">{topPerformer?.regionName || 'Analyzing...'}</h4>
              <p className="text-sm text-[var(--color-outline)] mt-1 mb-4">Highest quarterly intake.</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[var(--color-primary)] tracking-tighter">
                  {topPerformer ? formatCurrency(topPerformer.receivedAmount) : '$0'}
                </span>
                <span className="text-[var(--color-secondary)] font-bold text-sm">+{topPerformer ? ((topPerformer.receivedAmount / (perfRes?.data?.summary?.totalReceivedAmount || 1)) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            <div className="flex-1 bg-[var(--color-surface-container-lowest)] rounded-lg p-6 relative overflow-hidden border border-[var(--color-outline-variant)]/10 shadow-sm">
              <span className="text-[10px] font-bold text-[var(--color-on-error-container)] bg-[var(--color-error-container)] px-2 py-1 rounded mb-4 inline-block tracking-wider uppercase">Attention Required</span>
              <h4 className="text-2xl font-black text-[var(--color-primary)]">{attentionRequired?.regionName || 'Analyzing...'}</h4>
              <p className="text-sm text-[var(--color-outline)] mt-1 mb-4">High delinquency detected.</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[var(--color-primary)] tracking-tighter">
                   {attentionRequired?.overdueCustomers || 0}
                </span>
                <span className="text-red-400 font-bold text-sm">Overdue</span>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Table */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-lg overflow-hidden border border-[var(--color-outline-variant)]/10">
          <div className="px-8 py-6 border-b border-[var(--color-surface-container)]">
             <h3 className="text-xl font-bold text-[var(--color-primary)]">Regional Breakdown</h3>
             <p className="text-sm text-[var(--color-outline)]">Diagnostic view of customer health and revenue sustainability.</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface-container-low)]">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest">Region Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest text-center">Customers</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest">Status Ratio</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest">Total Revenue</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest text-right">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-container)]">
              {isLoading ? (
                <tr><td colSpan={5} className="p-20 text-center text-[var(--color-outline)] animate-pulse">Fetching regional intelligence...</td></tr>
              ) : regionsData.map((reg: any) => {
                const activePerc = Math.round((reg.activeCustomers / reg.customerCount) * 100) || 0;
                const overduePerc = Math.round((reg.overdueCustomers / reg.customerCount) * 100) || 0;
                const otherPerc = 100 - activePerc - overduePerc;

                return (
                  <tr key={reg.regionId} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[var(--color-primary)]">hub</span>
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{reg.regionName}</p>
                          <p className="text-xs text-[var(--color-outline)]">{reg.regionCode || 'No Code'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="font-bold text-lg text-white">{reg.customerCount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-6 w-1/4">
                       <div className="flex flex-col gap-1.5">
                         <div className="h-2 w-full flex rounded-full overflow-hidden bg-slate-800">
                           <div className="h-full bg-[var(--color-secondary)]" style={{ width: `${activePerc}%` }}></div>
                           <div className="h-full bg-slate-600" style={{ width: `${otherPerc}%` }}></div>
                           <div className="h-full bg-red-500" style={{ width: `${overduePerc}%` }}></div>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-[var(--color-outline)]">
                           <span>Active ({activePerc}%)</span>
                           <span>Overdue ({overduePerc}%)</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <p className="font-bold text-white">{formatCurrency(reg.receivedAmount)}</p>
                       <p className="text-xs text-[var(--color-outline)]">ARPU: {formatCurrency(reg.receivedAmount / (reg.customerCount || 1))}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs ${reg.collectionRate >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                         {reg.collectionRate}%
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="px-8 py-4 bg-slate-900/40 flex justify-between items-center text-xs text-[var(--color-outline)] font-medium">
             <p>Monitoring {regionsData.length} strategic regions</p>
             <div className="flex gap-2">
               <button className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
               <button className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
