'use client';

import React, { useEffect, useState } from 'react';
import { useDealsStore } from '@/lib/stores/deals';
import { PipelineOverview } from './pipeline-overview';
import { SentimentChart } from './sentiment-chart';
import { RecentActivity } from './recent-activity';
import { DealMetrics } from './deal-metrics';
import { AlertsPanel } from './alerts-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Target, Clock } from 'lucide-react';

export function Dashboard() {
  const { deals, fetchDeals } = useDealsStore();
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    avgDealSize: 0,
    winRate: 0,
    avgSalesCycle: 0,
  });

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    // Calculate metrics
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;
    
    const closedDeals = deals.filter(deal => 
      deal.stage === 'Closed Won' || deal.stage === 'Closed Lost'
    );
    const wonDeals = deals.filter(deal => deal.stage === 'Closed Won');
    const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0;

    // Calculate average sales cycle (simplified)
    const avgSalesCycle = 45; // Placeholder

    setMetrics({
      totalValue,
      avgDealSize,
      winRate,
      avgSalesCycle,
    });
  }, [deals]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(metrics.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {deals.length} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(metrics.avgDealSize / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Per deal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Closed deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sales Cycle</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgSalesCycle} days</div>
            <p className="text-xs text-muted-foreground">
              Lead to close
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineOverview deals={deals} />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart />
        <RecentActivity />
      </div>

      <DealMetrics deals={deals} />
    </div>
  );
}