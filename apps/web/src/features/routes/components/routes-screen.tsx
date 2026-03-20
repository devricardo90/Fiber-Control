'use client';

import React from 'react';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MoreHorizontal, 
  Plus, 
  Filter, 
  Navigation, 
  Truck, 
  User as UserIcon, 
  ExternalLink, 
  Share2,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { todayRoutes, routesSummary, mapMarkers } from '../data/routes-data';

export function RoutesScreen() {
  return (
    <div className="px-10 pb-10 pt-4 flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* Header Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Routes Planning</h1>
            <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6b9d7a] animate-pulse"></div>
              <span className="text-[10px] font-black text-[#6b9d7a] uppercase tracking-widest">Live Network Status</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex -space-x-2 mr-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0c0e12] bg-gradient-to-br from-[#2a4d8a] to-[#4a3668] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  U{i}
                </div>
              ))}
           </div>
           <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
           </button>
           <button className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[#3a5d9a] text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#2a4d8a]/15 transition-all flex items-center gap-2">
              <Plus className="w-3 h-3" />
              New Route
           </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="flex gap-4">
        {routesSummary.map((stat, idx) => (
          <div key={idx} className="bg-[#1a1c23]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 min-w-[200px]">
            <p className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-[10px] font-bold text-[#6b9d7a]">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-[600px]">
        
        {/* Left Column: Routes List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 ">
          <div className="bg-[#1a1c23]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Today's Routes</h2>
              <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-white">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
              {todayRoutes.map((group, gIdx) => (
                <div key={gIdx} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">{group.group}</span>
                    <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] italic">{group.visits} VISITS</span>
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xs font-black text-white mb-1">{item.title}</h3>
                            <p className="text-[10px] text-[var(--color-on-surface-variant)] font-bold">{item.subtitle}</p>
                          </div>
                          <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-${item.statusColor}-500/20 bg-${item.statusColor}-500/10 text-${item.statusColor}-400`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--color-on-surface-variant)] uppercase">
                              <Clock className="w-3 h-3" />
                              {item.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#c27070] uppercase">
                              <AlertTriangle className="w-3 h-3" />
                              {item.priority}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-4 bg-gradient-to-r from-[var(--color-primary)]/80 to-[#3d5a8a]/80 hover:from-[var(--color-primary)] hover:to-[#3d5a8a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98] shadow-xl shadow-[#2a4d8a]/10">
              Plan Today's Visits
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Map Mock */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
          <div className="bg-[#1a1c23]/60 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden relative group h-full shadow-2xl">
            
            {/* Map Background Mock */}
            <div className="absolute inset-0 bg-[#0c0e12] overflow-hidden">
               {/* Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
               
               {/* Mock Map Lines */}
               <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
                  <path d="M100 200 L300 150 L450 400 L700 350 L850 600" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8,4" />
                  <path d="M100 800 L300 700 L500 750 L600 550 L850 600" fill="none" stroke="emerald" strokeWidth="2" strokeDasharray="8,4" />
               </svg>

               {/* Map Markers */}
                   {mapMarkers.map(m => (
                 <div key={m.id} className="absolute transition-transform hover:scale-125 cursor-pointer" style={{left: `${m.x}%`, top: `${m.y}%`}}>
                   <div className={`w-8 h-8 rounded-full border-2 border-[#0c0e12] flex items-center justify-center text-[10px] font-black shadow-2xl ${
                     m.label === 'H' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#6b9d7a] text-white'
                   }`}>
                     {m.label}
                   </div>
                   {m.label === 'H' && <div className="absolute -inset-2 bg-[var(--color-primary)]/15 blur-xl rounded-full -z-10 animate-pulse"></div>}
                 </div>
               ))}
            </div>

            {/* Map Tabs */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="bg-[#0c0e12]/80 backdrop-blur-md rounded-2xl p-1.5 flex gap-1 border border-white/5 shadow-2xl">
                 {['All Areas', 'North Sector', 'Coastal Line'].map((tab, i) => (
                  <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    i === 0 ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[#2a4d8a]/20' : 'text-[var(--color-on-surface-variant)] hover:text-white'
                  }`}>
                    {tab}
                  </button>
                ))}
              </div>
              <button className="bg-[#0c0e12]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-2xl">
                <Filter className="w-3 h-3" />
                Advanced Filters
              </button>
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute bottom-24 right-6 flex flex-col gap-2">
               <button className="w-10 h-10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center justify-center hover:bg-[var(--color-primary)] transition-all shadow-2xl">
                  <ZoomIn className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center justify-center hover:bg-[var(--color-primary)] transition-all shadow-2xl">
                  <ZoomOut className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center justify-center hover:bg-[var(--color-primary)] transition-all shadow-2xl mt-4">
                  <Navigation className="w-4 h-4" />
               </button>
            </div>

            {/* Optimal Route Card Over Map */}
            <div className="absolute bottom-6 left-6 w-64 bg-[#0c0e12]/90 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-left-4 duration-1000">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#6b9d7a]/10 flex items-center justify-center">
                     <Truck className="w-5 h-5 text-[#6b9d7a]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest leading-none mb-1">Optimal Route</h4>
                    <p className="text-xs font-black text-white uppercase">Technician Team Beta</p>
                  </div>
               </div>
               <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase">Efficiency Score</span>
                    <span className="text-[10px] font-black text-[#6b9d7a]">98.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6b9d7a] w-[98.4%] rounded-full"></div>
                  </div>
               </div>
            </div>
             
            {/* Bottom Controls Bar Overlay */}
            <div className="absolute bottom-6 right-20 left-72 bg-[#0c0e12]/80 backdrop-blur-md border border-white/5 rounded-[24px] p-4 flex items-center justify-between shadow-2xl">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">Vehicle</p>
                      <p className="text-[10px] font-black text-white uppercase">VAN-042</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">Assigned</p>
                      <p className="text-[10px] font-black text-white uppercase">D. Robinson</p>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button className="text-[9px] font-black text-[var(--color-on-surface-variant)] hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Export Manifest
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5">
                    <Share2 className="w-3 h-3" />
                    Share Live Track
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
