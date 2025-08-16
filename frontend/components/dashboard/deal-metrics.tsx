'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Deal } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface DealMetricsProps {
  deals: Deal[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export function DealMetrics({ deals }: DealMetricsProps) {
  // Deals by stage
  const stageData = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(stageData).map(([stage, count]) => ({
    name: stage,
    value: count,
  }));

  // Deals by value range
  const valueRanges = [
    { range: '< $50K', min: 0, max: 50000 },
    { range: '$50K - $100K', min: 50000, max: 100000 },
    { range: '$100K - $250K', min: 100000, max: 250000 },
    { range: '$250K - $500K', min: 250000, max: 500000 },
    { range: '> $500K', min: 500000, max: Infinity },
  ];

  const valueData = valueRanges.map(range => {
    const count = deals.filter(deal => {
      const value = deal.value || 0;
      return value >= range.min && value < range.max;
    }).length;
    
    return {
      range: range.range,
      count,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name || payload[0].payload.range}</p>
          <p className="text-blue-600">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deals by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Deals by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deals by Value Range */}
      <Card>
        <CardHeader>
          <CardTitle>Deals by Value Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="range" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">
                {formatCurrency(deals.reduce((sum, deal) => sum + (deal.value || 0), 0))}
              </div>
              <div className="text-gray-600">Total Pipeline Value</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {deals.length > 0 ? formatCurrency(deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length) : '$0'}
              </div>
              <div className="text-gray-600">Average Deal Size</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}