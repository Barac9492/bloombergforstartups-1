'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Deal } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PipelineOverviewProps {
  deals: Deal[];
}

const DEFAULT_STAGES = [
  'Lead',
  'Qualified',
  'Meeting Scheduled',
  'Proposal Sent',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

export function PipelineOverview({ deals }: PipelineOverviewProps) {
  const chartData = DEFAULT_STAGES.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage);
    const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    
    return {
      stage: stage.replace(' ', '\\n'),
      count: stageDeals.length,
      value: totalValue,
      valueInK: Math.round(totalValue / 1000),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label.replace('\\n', ' ')}</p>
          <p className="text-blue-600">
            Count: {payload[0].payload.count} deals
          </p>
          <p className="text-green-600">
            Value: {formatCurrency(payload[0].payload.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="stage" 
                fontSize={12}
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="valueInK" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length}
            </div>
            <div className="text-gray-600">Active Deals</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">
              {deals.filter(d => d.stage === 'Closed Won').length}
            </div>
            <div className="text-gray-600">Won</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">
              {deals.filter(d => d.stage === 'Closed Lost').length}
            </div>
            <div className="text-gray-600">Lost</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}