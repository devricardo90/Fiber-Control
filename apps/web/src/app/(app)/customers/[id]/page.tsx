'use client';

import { use, useEffect, useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Router, 
  CreditCard, 
  Edit, 
  PauseCircle, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  History,
  MessageSquare,
  Network
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { apiFetch } from '@/lib/api-client';

interface Payment {
  id: string;
  referenceMonth: string;
  expectedAmount: number;
  receivedAmount: number;
  status: string;
  paidAt: string | null;
  notes: string | null;
}

interface Customer {
  id: string;
  fullName: string;
  documentId: string;
  phone: string;
  email: string;
  addressLine: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
  status: string;
  monthlyFee: number;
  dueDay: number;
  graceDays: number;
  cutoffDays: number;
  serviceStartDate: string;
  regionId: string;
  region: {
    name: string;
    code: string;
  } | null;
  payments: Payment[];
  updatedAt: string;
}

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await apiFetch<{ data: Customer }>(`/customers/${id}`);
        setCustomer(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="text-[var(--color-on-surface-variant)] animate-pulse">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-10">
        <div className="bg-[#c27070]/10 border border-[#c27070]/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-[#c27070] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error loading data</h2>
          <p className="text-[var(--color-on-surface-variant)] mb-6">{error || 'Customer not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#c27070] text-white rounded-full font-bold hover:bg-[#b06060] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeMonths = 18;
  const avgLateness = 4;

  const chartData = [
    { name: 'JAN', days: 2, fill: 'var(--color-surface-container-highest)' },
    { name: 'FEB', days: 5, fill: 'var(--color-surface-container-highest)' },
    { name: 'MAR', days: 12, fill: '#c27070' },
    { name: 'APR', days: 3, fill: 'var(--color-surface-container-highest)' },
    { name: 'MAY', days: 8, fill: '#c27070' },
    { name: 'JUN', days: 2, fill: 'var(--color-surface-container-highest)' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'text-[#6b9d7a]',
          bg: 'bg-[#6b9d7a]/10',
          border: 'border-[#6b9d7a]/20',
        };
      case 'overdue':
        return {
          color: 'text-[#c27070]',
          bg: 'bg-[#c27070]/10',
          border: 'border-[#c27070]/20',
        };
      case 'suspended':
        return {
          color: 'text-[#b8895a]',
          bg: 'bg-[#b8895a]/10',
          border: 'border-[#b8895a]/20',
        };
      default:
        return {
          color: 'text-slate-400',
          bg: 'bg-slate-400/10',
          border: 'border-slate-400/20',
        };
    }
  };

  const status = getStatusConfig(customer.status);

  return (
    <div className="px-10 pb-20 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mb-8">
        <span>Customers</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">Details: {customer.fullName}</span>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Main Profile Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[#6b9d7a] rounded-[32px] opacity-15 blur group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-[#1a1c23]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[var(--color-primary)] to-[#3d5a8a] flex items-center justify-center shadow-2xl ring-4 ring-white/5">
                  <User className="w-10 h-10 text-white" />
                </div>

                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">{customer.fullName}</h1>
                    <span className={`px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${status.bg} ${status.color} ${status.border}`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-[var(--color-on-surface-variant)] font-medium mb-6">Account #{customer.id.toUpperCase().slice(-8)}</p>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">Monthly Fee</p>
                      <p className="text-2xl font-black text-white">${customer.monthlyFee.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">Due Day</p>
                      <p className="text-2xl font-black text-white">{customer.dueDay}th</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">Grace Period</p>
                      <p className="text-2xl font-black text-white">{customer.graceDays} Days</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">Cutoff</p>
                      <p className="text-2xl font-black text-white">{customer.cutoffDays} Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#6b9d7a]/5 border border-[#6b9d7a]/10 rounded-2xl p-4 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#6b9d7a]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-[#6b9d7a]" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Customer has been active for <span className="text-[#6b9d7a] font-bold">{activeMonths} months</span>
              </p>
            </div>
            <div className="bg-[#c27070]/5 border border-[#c27070]/10 rounded-2xl p-4 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#c27070]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <History className="w-5 h-5 text-[#c27070]" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Customer usually pays late (Avg <span className="text-[#c27070] font-bold">{avgLateness} days</span>)
              </p>
            </div>
          </div>

          {/* Two col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Connectivity */}
            <div className="space-y-8">
              <div className="bg-[#1a1c23]/60 backdrop-blur-lg border border-white/5 rounded-[24px] p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                    <Router className="w-4 h-4 text-[#8b9fc9]" />
                  </div>
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Connectivity</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-full">
                      <Phone className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase mb-1">Phone</p>
                      <p className="text-sm text-white font-medium">{customer.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-full">
                      <Mail className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase mb-1">Email</p>
                      <p className="text-sm text-white font-medium">{customer.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-full">
                      <MapPin className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase mb-1">Installation Address</p>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        {customer.addressLine}, {customer.addressNumber}<br />
                        {customer.neighborhood}, {customer.city} - {customer.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Node */}
              <div className="bg-[#1a1c23]/60 backdrop-blur-lg border border-white/5 rounded-[24px] p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6b9d7a]/10 rounded-lg">
                    <Network className="w-4 h-4 text-[#6b9d7a]" />
                  </div>
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Network Node</h3>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase mb-1">Region</p>
                    <p className="text-lg font-bold text-white">{customer.region?.name || 'N/A'}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Hub: {customer.region?.code || 'Unassigned'}</p>
                  </div>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
                    <MapPin className="w-3 h-3" />
                    View Route Map
                  </button>
                </div>
              </div>
            </div>

            {/* Ledger & Trends */}
            <div className="space-y-8">
              {/* Trends */}
              <div className="bg-[#1a1c23]/60 backdrop-blur-lg border border-white/5 rounded-[24px] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                      <TrendingDown className="w-4 h-4 text-[#8b9fc9]" />
                    </div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Payment Latency Trends</h3>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Last 6 Months</span>
                </div>

                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                      />
                      <Bar dataKey="days" radius={[6, 6, 0, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: 'white', fontWeight: 700, fontSize: 12 }}
                        itemStyle={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 12 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Ledger */}
              <div className="bg-[#1a1c23]/60 backdrop-blur-lg border border-white/5 rounded-[24px] p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#b8895a]/10 rounded-lg">
                    <History className="w-4 h-4 text-[#b8895a]" />
                  </div>
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Ledger</h3>
                </div>

                <div className="space-y-4">
                  {customer.payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="group p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-transparent transition-all hover:border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            payment.status === 'paid' ? 'bg-[#6b9d7a]/10' : 'bg-[#c27070]/10'
                          }`}>
                            {payment.status === 'paid' ? (
                              <CheckCircle2 className="w-4 h-4 text-[#6b9d7a]" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-[#c27070]" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Payment {payment.status === 'paid' ? 'Received' : 'Overdue'} — {payment.referenceMonth}
                            </p>
                            <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase font-semibold">
                              Method: Credit Card (**** 4421)
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-white">${payment.receivedAmount.toFixed(2)}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${
                            payment.status === 'paid' ? 'text-[#6b9d7a]' : 'text-[#c27070]'
                          }`}>
                            {payment.status === 'paid' ? 'Successful' : 'Late'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                    Load Full History
                  </button>
                </div>
              </div>

              {/* Field Observations */}
              <div className="bg-[#1a1c23]/60 backdrop-blur-lg border border-white/5 rounded-[24px] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-outline-variant)]/30 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Field Observations</h3>
                  </div>
                  <button className="text-white hover:scale-110 transition-transform">
                    <span className="text-xl">+</span>
                  </button>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 italic text-sm leading-relaxed text-slate-400 relative">
                  <span className="text-white/20 absolute top-2 left-2 text-4xl font-serif">"</span>
                  {customer.notes || 'No field observations recorded for this customer.'}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between not-italic">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                      Admin Note — {new Date(customer.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <span className="text-[10px] font-bold text-[#8b9fc9]">Marked as Relevant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="sticky top-8 space-y-6">
            {/* Register Payment */}
            <button className="w-full py-6 bg-gradient-to-r from-[var(--color-primary)] to-[#1e3668] hover:opacity-90 text-white rounded-3xl font-black uppercase tracking-[0.1em] shadow-2xl shadow-[#2a4d8a]/20 active:scale-95 transition-all flex items-center justify-center gap-3 ring-1 ring-white/10 group">
              <div className="p-2 bg-white/10 rounded-xl group-hover:rotate-12 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              Register Payment
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-6">
              <button className="h-40 bg-[#1a1c23]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit className="w-6 h-6 text-slate-300" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Edit</span>
              </button>
              <button className="h-40 bg-[#1a1c23]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 group hover:bg-[#c27070]/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#c27070]/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <PauseCircle className="w-6 h-6 text-[#c27070]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-[#c27070] transition-colors">Suspend</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
