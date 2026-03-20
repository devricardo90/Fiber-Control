'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RevenueTrendChartProps {
  data: any[];
}

export const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  const chartData = data.map((item) => ({
    name: item.referenceMonth,
    Expected: item.expectedAmount,
    Received: item.receivedAmount,
  }));

  return (
    <div className="bg-[#1c2026] p-8 rounded-2xl shadow-sm border border-white/5 h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white">Revenue Trend</h2>
        <div className="flex gap-2">
           <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
             <div className="w-2 h-2 rounded-full bg-indigo-500" /> Expected
           </span>
           <span className="flex items-center gap-1.5 text-xs font-bold text-lime-400">
             <div className="w-2 h-2 rounded-full bg-lime-500" /> Received
           </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8b919f', fontSize: 10, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8b919f', fontSize: 10, fontWeight: 600 }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#10131a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Bar dataKey="Expected" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
          <Bar dataKey="Received" fill="#84cc16" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
