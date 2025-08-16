'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search, 
  BarChart3, 
  Globe, 
  Building2,
  Users,
  Calendar,
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  PieChart,
  Activity
} from 'lucide-react';

interface TerminalProps {
  onCompanySelect?: (company: any) => void;
}

export function BloombergTerminal({ onCompanySelect }: TerminalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [marketData, setMarketData] = useState<any>(null);
  const [startupData, setStartupData] = useState<any>(null);

  // Mock data for demonstration
  const mockCompany = {
    name: 'TechFlow AI',
    symbol: 'TFAI',
    status: 'Private',
    sector: 'Artificial Intelligence',
    stage: 'Series B',
    valuation: 450000000,
    lastFunding: 75000000,
    fundingDate: '2024-01-15',
    headquarters: 'San Francisco, CA',
    employees: 180,
    founded: '2021',
    description: 'Advanced AI platform for enterprise automation and intelligent decision-making',
    metrics: {
      revenue: 12500000,
      revenueGrowth: 340,
      burnRate: 1200000,
      runway: 48,
      customers: 85,
      customerGrowth: 220
    },
    founders: [
      { name: 'Sarah Chen', role: 'CEO', background: 'Ex-Google AI' },
      { name: 'Marcus Rodriguez', role: 'CTO', background: 'Ex-Tesla Autopilot' }
    ],
    investors: [
      { name: 'Andreessen Horowitz', round: 'Series B', amount: 30000000 },
      { name: 'General Catalyst', round: 'Series B', amount: 25000000 },
      { name: 'Bloomberg Beta', round: 'Series A', amount: 15000000 }
    ],
    competitors: [
      { name: 'DataRobot', similarity: 78 },
      { name: 'H2O.ai', similarity: 65 },
      { name: 'Palantir', similarity: 52 }
    ],
    sentiment: {
      overall: 0.85,
      trend: 'positive',
      mentions: 342,
      news: [
        {
          title: 'TechFlow AI Closes $75M Series B Led by Andreessen Horowitz',
          source: 'TechCrunch',
          time: '2 hours ago',
          sentiment: 0.92
        },
        {
          title: 'Enterprise AI Market Sees Major Growth with TechFlow Leading Innovation',
          source: 'Forbes',
          time: '1 day ago',
          sentiment: 0.88
        }
      ]
    }
  };

  const marketMetrics = {
    aiMarket: {
      size: 136.55e9,
      growth: 37.3,
      projection: 1811.8e9
    },
    funding: {
      total: 108.5e9,
      deals: 4200,
      avgDeal: 25.8e6
    },
    valuations: {
      medianSeed: 8.5e6,
      medianSeriesA: 45e6,
      medianSeriesB: 180e6
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate search and select the mock company
      setSelectedCompany(mockCompany);
      onCompanySelect?.(mockCompany);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">BLOOMBERG</div>
            <div className="text-sm opacity-75">STARTUP TERMINAL</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-green-400">●</span> LIVE DATA
            </div>
            <div className="text-sm">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-green-400" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search companies, investors, or sectors (e.g., TechFlow AI, Andreessen Horowitz, AI)"
            className="bg-black border-green-400 text-green-400 placeholder-green-600 font-mono"
          />
          <Button className="bg-green-600 hover:bg-green-700 text-black font-bold">
            SEARCH
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-900 border-r border-gray-700 min-h-screen">
          <div className="p-4">
            <div className="text-sm font-bold text-green-400 mb-4">FUNCTIONS</div>
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'COMPANY OVERVIEW', icon: Building2 },
                { id: 'financials', label: 'FINANCIALS', icon: DollarSign },
                { id: 'funding', label: 'FUNDING HISTORY', icon: TrendingUp },
                { id: 'investors', label: 'INVESTORS', icon: Users },
                { id: 'market', label: 'MARKET DATA', icon: BarChart3 },
                { id: 'sentiment', label: 'SENTIMENT', icon: Activity },
                { id: 'competitors', label: 'COMPETITORS', icon: Target },
                { id: 'news', label: 'NEWS & EVENTS', icon: Globe }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-2 rounded flex items-center space-x-2 text-sm ${
                    activeSection === item.id
                      ? 'bg-green-600 text-black font-bold'
                      : 'text-green-400 hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {!selectedCompany ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-xl mb-2">Welcome to Bloomberg Startup Terminal</div>
              <div className="text-green-600">Search for a company to get started</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Company Header */}
              <Card className="bg-gray-900 border-green-400 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h1 className="text-3xl font-bold text-green-400">{selectedCompany.name}</h1>
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                        {selectedCompany.status}
                      </span>
                      <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded">
                        {selectedCompany.stage}
                      </span>
                    </div>
                    <div className="text-green-600 mb-4">{selectedCompany.description}</div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">SECTOR</div>
                        <div className="text-green-400">{selectedCompany.sector}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">FOUNDED</div>
                        <div className="text-green-400">{selectedCompany.founded}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">EMPLOYEES</div>
                        <div className="text-green-400">{selectedCompany.employees}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">HQ</div>
                        <div className="text-green-400">{selectedCompany.headquarters}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-400 mb-1">
                      {formatCurrency(selectedCompany.valuation)}
                    </div>
                    <div className="text-sm text-gray-400">VALUATION</div>
                    <div className="text-lg text-green-400 mt-2">
                      {formatCurrency(selectedCompany.lastFunding)}
                    </div>
                    <div className="text-sm text-gray-400">LAST FUNDING</div>
                  </div>
                </div>
              </Card>

              {/* Dynamic Content Based on Active Section */}
              {activeSection === 'overview' && (
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-xl font-bold text-green-400 mb-4">KEY METRICS</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Annual Revenue</span>
                        <span className="text-green-400">{formatCurrency(selectedCompany.metrics.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Growth</span>
                        <span className="text-green-400">{formatPercent(selectedCompany.metrics.revenueGrowth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Burn</span>
                        <span className="text-red-400">{formatCurrency(selectedCompany.metrics.burnRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Runway</span>
                        <span className="text-yellow-400">{selectedCompany.metrics.runway} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customers</span>
                        <span className="text-green-400">{selectedCompany.metrics.customers}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-xl font-bold text-green-400 mb-4">FOUNDERS</h2>
                    <div className="space-y-4">
                      {selectedCompany.founders.map((founder: any, index: number) => (
                        <div key={index} className="border-b border-gray-700 pb-3">
                          <div className="font-bold text-green-400">{founder.name}</div>
                          <div className="text-sm text-gray-400">{founder.role}</div>
                          <div className="text-sm text-green-600">{founder.background}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeSection === 'funding' && (
                <Card className="bg-gray-900 border-green-400 p-6">
                  <h2 className="text-xl font-bold text-green-400 mb-4">FUNDING HISTORY</h2>
                  <div className="space-y-4">
                    {selectedCompany.investors.map((investor: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-800 rounded">
                        <div>
                          <div className="font-bold text-green-400">{investor.name}</div>
                          <div className="text-sm text-gray-400">{investor.round}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400">{formatCurrency(investor.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeSection === 'sentiment' && (
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-xl font-bold text-green-400 mb-4">SENTIMENT ANALYSIS</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Overall Sentiment</span>
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-bold text-green-400">
                            {(selectedCompany.sentiment.overall * 100).toFixed(0)}%
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-400" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mentions (24h)</span>
                        <span className="text-green-400">{selectedCompany.sentiment.mentions}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${selectedCompany.sentiment.overall * 100}%` }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-xl font-bold text-green-400 mb-4">RECENT NEWS</h2>
                    <div className="space-y-3">
                      {selectedCompany.sentiment.news.map((news: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-800 rounded">
                          <div className="text-sm font-bold text-green-400 mb-1">{news.title}</div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{news.source}</span>
                            <span className="text-green-600">{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeSection === 'market' && (
                <div className="grid grid-cols-3 gap-6">
                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-lg font-bold text-green-400 mb-4">MARKET SIZE</h2>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency(marketMetrics.aiMarket.size)}
                        </div>
                        <div className="text-sm text-gray-400">Current Market</div>
                      </div>
                      <div>
                        <div className="text-lg text-green-400">
                          {formatPercent(marketMetrics.aiMarket.growth)}
                        </div>
                        <div className="text-sm text-gray-400">CAGR</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-lg font-bold text-green-400 mb-4">FUNDING MARKET</h2>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency(marketMetrics.funding.total)}
                        </div>
                        <div className="text-sm text-gray-400">Total Funding (2024)</div>
                      </div>
                      <div>
                        <div className="text-lg text-green-400">
                          {marketMetrics.funding.deals.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Deals</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-400 p-6">
                    <h2 className="text-lg font-bold text-green-400 mb-4">VALUATIONS</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Seed</span>
                        <span className="text-green-400">{formatCurrency(marketMetrics.valuations.medianSeed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Series A</span>
                        <span className="text-green-400">{formatCurrency(marketMetrics.valuations.medianSeriesA)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Series B</span>
                        <span className="text-green-400">{formatCurrency(marketMetrics.valuations.medianSeriesB)}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-700 p-4 text-center text-sm text-gray-400">
        <div>Bloomberg Startup Terminal • Real-time startup intelligence and market data</div>
      </div>
    </div>
  );
}