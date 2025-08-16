'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Monitor, TrendingUp, DollarSign, Activity, 
  Search, Filter, Download, Settings, 
  ChevronDown, ChevronRight, Maximize2,
  BarChart3, LineChart, PieChart, Globe,
  Calendar, Clock, Users, Target, Zap,
  AlertTriangle, CheckCircle, Database
} from 'lucide-react';

interface TerminalData {
  marketData: {
    indices: { name: string; value: number; change: number }[];
    deals: any[];
    alerts: any[];
  };
  realTimeMetrics: {
    totalPipeline: number;
    activeDeals: number;
    avgDealSize: number;
    conversionRate: number;
  };
}

export function BloombergStyleTerminal() {
  const [activePanel, setActivePanel] = useState('overview');
  const [terminalData, setTerminalData] = useState<TerminalData | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['market', 'pipeline']);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setTerminalData({
        marketData: {
          indices: [
            { name: 'STARTUP INDEX', value: 2847.32, change: 0.82 },
            { name: 'VC FLOW', value: 1245.67, change: -0.15 },
            { name: 'TECH MOMENTUM', value: 3421.89, change: 1.24 }
          ],
          deals: [],
          alerts: []
        },
        realTimeMetrics: {
          totalPipeline: 12400000,
          activeDeals: 47,
          avgDealSize: 263829,
          conversionRate: 23.4
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm min-h-screen p-4">
      {/* Terminal Header */}
      <div className="border border-green-500/30 bg-black/50 p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">BLOOMBERG FOR STARTUPS</span>
            </div>
            <div className="text-green-400">{currentTime}</div>
            <div className="text-blue-400">LIVE</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400">USER: INVESTOR_001</div>
            <div className="flex space-x-1">
              {['F1', 'F2', 'F3', 'F4', 'F5'].map(key => (
                <div key={key} className="bg-yellow-600 text-black px-2 py-1 text-xs">
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
        {/* Left Panel - Market Data */}
        <div className="col-span-3 space-y-4">
          {/* Market Indices */}
          <div className="border border-green-500/30 bg-black/30">
            <div 
              className="flex items-center justify-between p-2 bg-green-900/20 cursor-pointer"
              onClick={() => toggleSection('market')}
            >
              <span className="text-yellow-400 font-semibold">MARKET INDICES</span>
              {expandedSections.includes('market') ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </div>
            
            {expandedSections.includes('market') && (
              <div className="p-3 space-y-2">
                {terminalData?.marketData.indices.map((index, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-blue-400">{index.name}</span>
                    <div className="text-right">
                      <div className="text-white">{index.value.toFixed(2)}</div>
                      <div className={`text-xs ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border border-green-500/30 bg-black/30">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">QUICK ACTIONS</span>
            </div>
            <div className="p-3 space-y-2">
              {[
                { key: 'DES', desc: 'Deal Description', icon: Search },
                { key: 'SCR', desc: 'Screener', icon: Filter },
                { key: 'ANT', desc: 'Analytics', icon: BarChart3 },
                { key: 'EXP', desc: 'Export Data', icon: Download },
                { key: 'SET', desc: 'Settings', icon: Settings }
              ].map((action, i) => (
                <div key={i} className="flex items-center space-x-2 text-blue-400 hover:text-white cursor-pointer">
                  <action.icon className="w-3 h-3" />
                  <span className="text-yellow-400">{action.key}</span>
                  <span className="text-xs">{action.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="border border-green-500/30 bg-black/30">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">SYSTEM STATUS</span>
            </div>
            <div className="p-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Data Feed:</span>
                <span className="text-green-400">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>API Status:</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Last Update:</span>
                <span className="text-blue-400">00:01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Main Content */}
        <div className="col-span-6 space-y-4">
          {/* Pipeline Overview */}
          <div className="border border-green-500/30 bg-black/30 h-1/2">
            <div className="flex items-center justify-between p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">PIPELINE OVERVIEW</span>
              <div className="flex space-x-2">
                <LineChart className="w-4 h-4 text-blue-400 cursor-pointer" />
                <BarChart3 className="w-4 h-4 text-blue-400 cursor-pointer" />
                <PieChart className="w-4 h-4 text-blue-400 cursor-pointer" />
                <Maximize2 className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
            
            <div className="p-4 h-full">
              {/* Real-time metrics display */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl text-white font-bold">
                    {terminalData ? formatCurrency(terminalData.realTimeMetrics.totalPipeline) : '--'}
                  </div>
                  <div className="text-xs text-gray-400">TOTAL PIPELINE</div>
                </div>
                <div className="text-center">
                  <div className="text-xl text-green-400 font-bold">
                    {terminalData?.realTimeMetrics.activeDeals || '--'}
                  </div>
                  <div className="text-xs text-gray-400">ACTIVE DEALS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl text-blue-400 font-bold">
                    {terminalData ? formatCurrency(terminalData.realTimeMetrics.avgDealSize) : '--'}
                  </div>
                  <div className="text-xs text-gray-400">AVG DEAL SIZE</div>
                </div>
                <div className="text-center">
                  <div className="text-xl text-yellow-400 font-bold">
                    {terminalData?.realTimeMetrics.conversionRate.toFixed(1) || '--'}%
                  </div>
                  <div className="text-xs text-gray-400">CONVERSION</div>
                </div>
              </div>

              {/* ASCII-style chart placeholder */}
              <div className="border border-gray-600 p-3 bg-black/50 h-32 font-mono text-xs">
                <div className="text-green-400">PIPELINE VELOCITY CHART</div>
                <div className="mt-2 text-gray-500">
                  {`│`}<br/>
                  {`│  ▄▄▄`}<br/>
                  {`│ ▄    ▄▄`}<br/>
                  {`│▄        ▄▄▄`}<br/>
                  {`└─────────────────`}<br/>
                  <span className="text-blue-400">Q1  Q2  Q3  Q4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Flow */}
          <div className="border border-green-500/30 bg-black/30 h-1/2">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">DEAL FLOW - LIVE</span>
            </div>
            <div className="p-3 overflow-y-auto max-h-48">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="text-left p-1">COMPANY</th>
                    <th className="text-left p-1">STAGE</th>
                    <th className="text-right p-1">VALUE</th>
                    <th className="text-right p-1">PROB</th>
                    <th className="text-right p-1">CHG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { company: 'TECHSTART_001', stage: 'SEED', value: 500000, prob: 75, change: 0.12 },
                    { company: 'AIVCORP_002', stage: 'SERIESA', value: 2000000, prob: 45, change: -0.05 },
                    { company: 'FINTECH_003', stage: 'SEED', value: 750000, prob: 62, change: 0.08 },
                    { company: 'BIOTECH_004', stage: 'SERIESB', value: 5000000, prob: 32, change: -0.15 },
                    { company: 'CLIMATE_005', stage: 'SEED', value: 1200000, prob: 78, change: 0.25 }
                  ].map((deal, i) => (
                    <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                      <td className="p-1 text-blue-400">{deal.company}</td>
                      <td className="p-1 text-yellow-400">{deal.stage}</td>
                      <td className="p-1 text-right text-white">{formatCurrency(deal.value)}</td>
                      <td className="p-1 text-right text-green-400">{deal.prob}%</td>
                      <td className={`p-1 text-right ${deal.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {deal.change >= 0 ? '+' : ''}{(deal.change * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Analytics & Alerts */}
        <div className="col-span-3 space-y-4">
          {/* AI Intelligence */}
          <div className="border border-green-500/30 bg-black/30">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">AI INTELLIGENCE</span>
            </div>
            <div className="p-3 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-blue-400">CONFIDENCE:</span>
                <span className="text-green-400">87%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400">SIGNALS:</span>
                <span className="text-white">247</span>
              </div>
              <div className="mt-2 p-2 bg-green-900/10 border border-green-600/30">
                <div className="text-green-400 mb-1">RECOMMENDATION:</div>
                <div className="text-xs text-gray-300">
                  PRIORITY: TECHSTART_001
                  <br/>REASON: STRONG TECHNICAL METRICS
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="border border-green-500/30 bg-black/30">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">ALERTS</span>
            </div>
            <div className="p-3 space-y-2 text-xs max-h-40 overflow-y-auto">
              {[
                { type: 'warning', msg: 'BIOTECH_004 probability dropped 15%', time: '14:32' },
                { type: 'success', msg: 'CLIMATE_005 new funding announcement', time: '14:15' },
                { type: 'info', msg: 'Market sentiment: POSITIVE trend', time: '14:01' },
                { type: 'warning', msg: 'API rate limit: 85% capacity', time: '13:45' }
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-2 p-1 border-l-2 border-yellow-600/50">
                  {alert.type === 'warning' && <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="w-3 h-3 text-blue-400 mt-0.5" />}
                  <div className="flex-1">
                    <div className="text-white">{alert.msg}</div>
                    <div className="text-gray-400 text-xs">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Function Keys Guide */}
          <div className="border border-green-500/30 bg-black/30">
            <div className="p-2 bg-green-900/20">
              <span className="text-yellow-400 font-semibold">FUNCTION KEYS</span>
            </div>
            <div className="p-3 space-y-1 text-xs">
              {[
                { key: 'F1', action: 'Help/Commands' },
                { key: 'F2', action: 'Deal Search' },
                { key: 'F3', action: 'Screening' },
                { key: 'F4', action: 'Analytics' },
                { key: 'F5', action: 'Refresh Data' },
                { key: 'F9', action: 'Export' },
                { key: 'F10', action: 'Settings' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-yellow-400">{item.key}</span>
                  <span className="text-gray-400">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-green-500/30 bg-black/50 p-2 mt-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-green-400">● CONNECTED</span>
            <span className="text-blue-400">DATA: REAL-TIME</span>
            <span className="text-yellow-400">LATENCY: 12ms</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">© BLOOMBERG FOR STARTUPS 2024</span>
            <span className="text-gray-400">VERSION 2.1.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}