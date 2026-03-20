'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
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
    enabled: isAuthenticated && Boolean(token)
  });
  
  const { data: overRes } = useQuery({
    queryKey: ['reports', 'overdue', token],
    queryFn: () => apiRequest<any>('/reports/overdue', { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token)
  });

  const { data: annRes } = useQuery({
    queryKey: ['reports', 'annual-summary', currentYear, token],
    queryFn: () => apiRequest<any>(`/reports/annual-summary?year=${currentYear}`, { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token)
  });

  const { data: regRes } = useQuery({
    queryKey: ['reports', 'regions', currentMonth, token],
    queryFn: () => apiRequest<any>(`/reports/regions?referenceMonth=${currentMonth}`, { token }),
    retry: false,
    enabled: isAuthenticated && Boolean(token)
  });

  const revData = revRes?.data?.summary;
  const overdueData = overRes?.data?.summary;
  const annData = annRes?.data?.monthlyBreakdown ?? [];
  const regData = regRes?.data?.regions ?? [];
  
  // Formatters
  const fCurrency = (num = 0) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const fNumber = (num = 0) => new Intl.NumberFormat('en-US').format(num);

  return (
      <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] antialiased relative min-h-screen selection:bg-[var(--color-primary-container)] selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* SideNavBar Shell */}
        <aside className="flex flex-col h-full py-6 bg-slate-900 border-r-0 fixed left-0 top-0 w-64 z-50">
           <div className="px-8 mb-10">
             <span className="text-2xl font-black tracking-tight text-indigo-300">FiberControl</span>
             <p className="text-[10px] uppercase tracking-widest text-[var(--color-outline)] font-bold mt-1">SaaS Platform</p>
           </div>
           
           <nav className="flex-1 space-y-1">
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-lime-400 font-bold bg-slate-800 rounded-l-full ml-4 shadow-sm">
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
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
               <span className="material-symbols-outlined">account_balance</span>
               <span className="text-sm">Finance</span>
             </a>
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-300 transition-colors duration-200">
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
             <button className="w-full py-4 px-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-98 active:opacity-80">
               <span className="material-symbols-outlined">help</span> Support
             </button>
           </div>
        </aside>

        {/* TopNavBar Shell */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 flex justify-between items-center h-20 px-8 ml-64 bg-slate-900/80 backdrop-blur-xl shadow-sm shadow-indigo-900/5">
            <div className="flex items-center gap-4 w-96">
               <div className="relative w-full">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">search</span>
                 <input type="text" className="w-full bg-[var(--color-surface-container-high)] border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-white" placeholder="Search operational data..." />
               </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border-r border-[#414753] pr-6">
                   <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-all relative">
                     <span className="material-symbols-outlined">notifications</span>
                     <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
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

        {/* Main Canvas */}
        <main className="ml-64 pt-28 px-10 pb-12 min-h-screen">

            
            {/* KPI Header */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                
                <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm border-none flex flex-col justify-between">
                   <div>
                     <span className="text-[var(--color-outline)] font-semibold text-xs uppercase tracking-wider">Revenue This Month</span>
                     <h3 className="text-4xl font-black text-[var(--color-primary)] mt-2">
                       {revData ? fCurrency(revData.receivedAmount) : '$42,000'}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2 mt-4 text-[var(--color-on-secondary-container)]">
                     <span className="material-symbols-outlined text-sm">trending_up</span>
                     <span className="text-sm font-bold">+0% from last month</span>
                   </div>
                </div>

                <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm border-none flex flex-col justify-between">
                   <div>
                     <span className="text-[var(--color-outline)] font-semibold text-xs uppercase tracking-wider">Active Customers</span>
                     <h3 className="text-4xl font-black text-[var(--color-primary)] mt-2">
                        {overdueData ? fNumber(overdueData.totalCustomers) : '1,240'}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2 mt-4 text-[var(--color-outline)]">
                     <span className="material-symbols-outlined text-sm">person_check</span>
                     <span className="text-sm font-medium">94% Retention rate</span>
                   </div>
                </div>

                <div className="bg-[var(--color-error-container)] p-8 rounded-2xl shadow-sm border-none flex flex-col justify-between">
                   <div>
                     <span className="text-[var(--color-on-error-container)] font-semibold text-xs uppercase tracking-wider">Overdue Customers</span>
                     <div className="flex items-center gap-4 mt-2">
                       <h3 className="text-4xl font-black text-[var(--color-on-error-container)]">
                          {overdueData?.overdueCustomers ?? 12}
                       </h3>
                       <span className="bg-[var(--color-error)] text-[var(--color-on-error)] text-[10px] px-2 py-0.5 rounded-full font-bold">ACTION REQ</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 mt-4 text-[var(--color-on-error-container)]">
                     <span className="material-symbols-outlined text-sm">warning</span>
                     <span className="text-sm font-medium">Requires follow-up</span>
                   </div>
                </div>

                <div className="bg-[var(--color-secondary-container)] p-8 rounded-2xl shadow-sm border-none flex flex-col justify-between">
                   <div>
                     <span className="text-[var(--color-on-secondary-container)] font-semibold text-xs uppercase tracking-wider">Suspended Today</span>
                     <h3 className="text-4xl font-black text-[var(--color-on-secondary-container)]">
                        {overdueData?.suspendedCustomers ?? 3}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2 mt-4 text-[var(--color-on-secondary-container)]">
                     <span className="material-symbols-outlined text-sm">block</span>
                     <span className="text-sm font-medium">Auto-suspension active</span>
                   </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="grid grid-cols-12 gap-8 mb-12">
                {/* Revenue Trend Chart */}
                <div className="col-span-12 lg:col-span-8">
                   <RevenueTrendChart data={annData} />
                </div>

                {/* Critical Alerts */}
                <div className="col-span-12 lg:col-span-4 bg-[var(--color-surface-container-high)] rounded-2xl p-8 overflow-hidden relative">
                   <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6">Critical Alerts</h2>
                   <div className="space-y-4">
                      
                      <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl flex gap-4 border-l-4 border-[var(--color-error)]">
                         <div className="w-10 h-10 rounded-full bg-[var(--color-error-container)] flex items-center justify-center text-[var(--color-error)] flex-shrink-0">
                           <span className="material-symbols-outlined">priority_high</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-[var(--color-on-surface)]">12 Accounts Overdue</p>
                           <p className="text-xs text-[var(--color-outline)] mt-1">Pending total: $4,230.00</p>
                         </div>
                      </div>

                      <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl flex gap-4 border-l-4 border-[var(--color-secondary)]">
                         <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-on-secondary-container)] flex-shrink-0">
                           <span className="material-symbols-outlined">hourglass_empty</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-[var(--color-on-surface)]">Suspension Warning</p>
                           <p className="text-xs text-[var(--color-outline)] mt-1">45 accounts approaching limit</p>
                         </div>
                      </div>

                      <div className="bg-[var(--color-primary)] p-4 rounded-xl flex gap-4 text-slate-900 border-l-4 border-[var(--color-on-primary-container)]">
                         <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] flex-shrink-0">
                           <span className="material-symbols-outlined">calendar_today</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-[var(--color-on-primary-container)]">Tax Deadline Approaching</p>
                           <p className="text-xs text-slate-800 opacity-90 font-medium mt-1">Q3 Fiscal reports due in 4 days</p>
                         </div>
                      </div>

                   </div>
                   
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl" />
                </div>
            </section>

            {/* Bottom Row */}
            <section className="grid grid-cols-12 gap-8">
               
               {/* Regional Performance */}
               <div className="col-span-12 lg:col-span-4">
                 <RegionalPerformance regions={regData} />
               </div>

               {/* Recent Activity */}
               <div className="col-span-12 lg:col-span-5 bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[var(--color-primary)]">Recent Activity</h2>
                    <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All</button>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[var(--color-primary)]">
                           <span className="material-symbols-outlined text-sm">credit_card</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold">Payment from Apex Corp</p>
                           <p className="text-xs text-[var(--color-outline)]">Processed 2 mins ago</p>
                         </div>
                       </div>
                       <span className="text-sm font-black text-[var(--color-on-secondary-container)]">+$1,250.00</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[var(--color-primary)]">
                           <span className="material-symbols-outlined text-sm">person_add</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold">New Subscription: Fiber Home</p>
                           <p className="text-xs text-[var(--color-outline)]">Processed 1 hour ago</p>
                         </div>
                       </div>
                       <span className="text-sm font-black text-[var(--color-on-secondary-container)]">+$89.00</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[var(--color-error-container)] flex items-center justify-center text-[var(--color-error)]">
                           <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold">Refund Processed</p>
                           <p className="text-xs text-[var(--color-outline)]">John Doe • #2304</p>
                         </div>
                       </div>
                       <span className="text-sm font-black text-[var(--color-error)]">-$45.00</span>
                    </div>
                 </div>
               </div>

               {/* Fiscal Reminders */}
               <div className="col-span-12 lg:col-span-3 bg-[var(--color-secondary-container)] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
                  <div className="z-10">
                    <h2 className="text-lg font-bold text-[var(--color-on-secondary-container)] mb-2">Fiscal Reminders</h2>
                    <p className="text-sm text-indigo-200/80 leading-relaxed">Ensure compliance for the current billing cycle by updating regional tax tables.</p>
                  </div>
                  
                  <div className="mt-6 z-10">
                    <button className="w-full bg-slate-100 text-[var(--color-secondary-container)] py-3 rounded-xl font-bold shadow-sm hover:bg-white transition-colors">
                       Update Tax Tables
                    </button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent)" }}></div>
               </div>

            </section>

        </main>
      </div>
  );
}
