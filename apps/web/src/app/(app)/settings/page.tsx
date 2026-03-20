'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/layout/auth-provider';

export default function SettingsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fiscal Data (Real API)
  const { data: taxRes, isLoading: isTaxLoading } = useQuery({
    queryKey: ['tax-config'],
    queryFn: () => apiRequest<any>('/tax-config'),
    enabled: !!token,
  });

  const [taxData, setTaxData] = useState({
    regimeLabel: 'Lucro Presumido',
    estimatedRate: 13.5,
    dueDay: 20
  });

  useEffect(() => {
    if (taxRes?.data) {
      setTaxData({
        regimeLabel: taxRes.data.regimeLabel,
        estimatedRate: Number(taxRes.data.estimatedRate),
        dueDay: taxRes.data.dueDay
      });
    }
  }, [taxRes]);

  const updateTax = useMutation({
    mutationFn: (newConfig: typeof taxData) => 
      apiRequest('/tax-config', {
        method: 'PUT',
        token,
        body: JSON.stringify(newConfig)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-config'] });
      alert('Configurações fiscais salvas com sucesso!');
    }
  });

  // 2. Company Info Data (Mocking state for now)
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Fiber Control Systems Ltd.',
    businessId: '32.894.102/0001-99',
    email: 'admin@fibercontrol.com',
    address: 'Av. Paulista, 1000, 14th Floor, Bela Vista, São Paulo - SP, 01310-100',
    timezone: '(GMT-03:00) Brasilia Time',
    currency: 'BRL - Brazilian Real'
  });

  const handleSave = () => {
    // For now we only persist tax to the backend
    updateTax.mutate(taxData);
  };

  return (
    <div className="bg-transparent text-[var(--color-on-surface)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main Content Canvas */}
      <div className="pb-32 min-h-screen">

      {/* Main Content Canvas */}
        <div className="max-w-6xl mx-auto px-8 py-12">
          
          {/* Settings Header Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-black tracking-tight font-headline text-[var(--color-primary)] mb-2">Platform Settings</h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg">Configure your organizational infrastructure and fiscal preferences.</p>
          </div>

          <div className="flex gap-12">
            {/* Settings Internal Navigation (Sub-sidebar) */}
            <nav className="w-64 flex flex-col gap-2 shrink-0">
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-bold shadow-sm">
                <span>Company Info</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface-variant)] font-medium">
                <span>Tax Config</span>
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface-variant)] font-medium">
                <span>Notifications</span>
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface-variant)] font-medium">
                <span>Users</span>
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface-variant)] font-medium">
                <span>Branding</span>
              </a>
              <a href="#" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface-variant)] font-medium">
                <span>Security</span>
              </a>
            </nav>

            {/* Form Area */}
            <div className="flex-1 space-y-10">
              
              {/* Company Information Card */}
              <section className="bg-[var(--color-surface-container-lowest)] rounded-lg p-10 shadow-sm border border-[var(--color-outline-variant)]">
                <div className="mb-8 border-b border-[var(--color-surface-container)] pb-6">
                  <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-1">Company Information</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-sm">Public details used for billing and identity.</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Company Name</label>
                    <input type="text" value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Business ID / CNPJ</label>
                    <input type="text" value={companyInfo.businessId} onChange={(e) => setCompanyInfo({...companyInfo, businessId: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Primary Contact Email</label>
                    <input type="email" value={companyInfo.email} onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Registered Address</label>
                    <textarea rows={3} value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">System Timezone</label>
                    <select value={companyInfo.timezone} onChange={(e) => setCompanyInfo({...companyInfo, timezone: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none appearance-none cursor-pointer">
                      <option>(GMT-03:00) Brasilia Time</option>
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Default Currency</label>
                    <select value={companyInfo.currency} onChange={(e) => setCompanyInfo({...companyInfo, currency: e.target.value})} className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none appearance-none cursor-pointer">
                      <option>BRL - Brazilian Real</option>
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Tax Configuration Card */}
              <section className="bg-[var(--color-surface-container-lowest)] rounded-lg p-10 shadow-sm border border-[var(--color-outline-variant)]">
                <div className="mb-8 border-b border-[var(--color-surface-container)] pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-[var(--color-primary)]">Tax Configuration</h3>
                    <span className="bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Fiscal Module</span>
                  </div>
                  <p className="text-[var(--color-on-surface-variant)] text-sm">Automate tax calculations for your region.</p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Tax Regime {isTaxLoading && <span className="opacity-50">(...)</span>}</label>
                    <select 
                      value={taxData.regimeLabel}
                      onChange={(e) => setTaxData({...taxData, regimeLabel: e.target.value})}
                      className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none appearance-none cursor-pointer pr-10">
                      <option>Lucro Presumido</option>
                      <option>Simple Nacional</option>
                      <option>Lucro Real</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 bottom-4 text-[var(--color-outline)] pointer-events-none">unfold_more</span>
                  </div>
                  
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Estimated Rate (%)</label>
                    <div className="relative w-full">
                      <input 
                        type="number" 
                        value={taxData.estimatedRate} 
                        onChange={(e) => setTaxData({...taxData, estimatedRate: Number(e.target.value)})}
                        className="w-full bg-[var(--color-surface-container-low)] text-white border-none rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-medium outline-none" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] px-1">Tax Due Day</label>
                    <div className="flex items-center bg-[var(--color-surface-container-low)] rounded-xl px-4 py-1">
                      <span className="material-symbols-outlined text-[var(--color-outline)]">calendar_today</span>
                      <input 
                        type="number" 
                        value={taxData.dueDay} 
                        onChange={(e) => setTaxData({...taxData, dueDay: Number(e.target.value)})}
                        className="w-full bg-transparent text-white border-none focus:ring-0 p-3 font-medium outline-none" />
                    </div>
                  </div>
                </div>

                {/* Smart Insight Area */}
                <div className="mt-10 p-6 bg-[var(--color-secondary-container)]/30 rounded-2xl flex gap-4 items-start border border-[var(--color-secondary-container)]">
                  <div className="p-2 bg-[var(--color-secondary)] rounded-full text-[var(--color-on-secondary)] shadow-sm">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>lightbulb</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">Tax Optimization Tip</h4>
                    <p className="text-sm text-[var(--color-on-surface)]/80 mt-1 leading-relaxed">
                      Based on your current fiber throughput, your business may benefit from a Lucro Real regime transition. Contact your finance advisor for an impact analysis.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Footer */}
      <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] bg-[#10131a]/95 backdrop-blur-md border-t border-[var(--color-surface-container-highest)] px-12 py-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="material-symbols-outlined text-emerald-400" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            <span className="text-sm font-bold">
              {updateTax.isPending ? 'Saving changes...' : 'All changes are validated and ready to sync.'}
            </span>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-full text-[var(--color-on-surface-variant)] font-bold hover:bg-[var(--color-surface-container)] transition-colors">Discard</button>
            <button 
              onClick={handleSave}
              disabled={updateTax.isPending}
              className="px-10 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-full font-bold shadow-xl active:scale-95 transition-all outline-none focus:ring-[var(--color-secondary)] focus:ring-2 disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
