'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface IncomeTrendChartProps {
  currentYearRevenue: number;
  lastYearRevenue: number;
}

export const IncomeTrendChart = ({ currentYearRevenue, lastYearRevenue }: IncomeTrendChartProps) => {
  // Simple visualization since we only have totals here, or we could use annual data if provided.
  // For now, let's create a simulated trend based on the totals.
  const data = [
    { name: 'Q1', current: currentYearRevenue * 0.2, previous: lastYearRevenue * 0.22 },
    { name: 'Q2', current: currentYearRevenue * 0.25, previous: lastYearRevenue * 0.24 },
    { name: 'Q3', current: currentYearRevenue * 0.3, previous: lastYearRevenue * 0.28 },
    { name: 'Q4', current: currentYearRevenue * 0.25, previous: lastYearRevenue * 0.26 },
  ];

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2a4d8a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2a4d8a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#10131a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="#2a4d8a" 
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="previous" 
            stroke="#414753" 
            fill="transparent" 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
