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
} from 'recharts';

interface ExpectedVsReceivedChartProps {
  data: any[];
}

export const ExpectedVsReceivedChart = ({ data }: ExpectedVsReceivedChartProps) => {
  const safeData = Array.isArray(data) ? data : [];

  const chartData = safeData.map((item) => ({
    name: item.referenceMonth?.split("-")[1] || "—", // Just the month number
    Expected: item.expectedAmount,
    Received: item.receivedAmount,
  }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8b919f', fontSize: 10, fontWeight: 600 }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#10131a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="Expected" fill="#2a4d8a" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="Received" fill="#9fa857" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
