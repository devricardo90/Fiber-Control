'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RegionalPerformanceProps {
  regions: any[];
}

const COLORS = ['#6366f1', '#84cc16', '#f59e0b', '#ec4899', '#06b6d4'];

export const RegionalPerformance = ({ regions }: RegionalPerformanceProps) => {
  const chartData = regions.map((reg) => ({
    name: reg.regionName,
    value: reg.customerCount,
  }));

  return (
    <div className="bg-[#1c2026] p-8 rounded-2xl shadow-sm border border-white/5 h-full">
      <h2 className="text-xl font-bold text-white mb-6">Regional Performance</h2>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#10131a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4">
         {regions.slice(0, 4).map((reg, idx) => (
           <div key={reg.regionId} className="flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
               <span className="text-sm font-medium text-slate-300">{reg.regionName}</span>
             </div>
             <span className="text-sm font-bold text-white">{reg.customerCount} customers</span>
           </div>
         ))}
      </div>
    </div>
  );
};
