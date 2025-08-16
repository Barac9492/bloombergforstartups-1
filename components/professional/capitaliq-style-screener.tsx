'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, Filter, Download, Save, Share2, 
  ChevronDown, ChevronRight, Plus, X,
  TrendingUp, TrendingDown, BarChart3,
  Grid, List, Map, Eye, Settings,
  Calendar, DollarSign, Users, Target,
  Building2, Globe, Briefcase, Star
} from 'lucide-react';

interface ScreenerCriteria {
  stage: string[];
  sector: string[];
  geography: string[];
  fundingRange: { min: number; max: number };
  teamSize: { min: number; max: number };
  ageRange: { min: number; max: number };
  customMetrics: { [key: string]: any };
}

interface CompanyResult {
  id: string;
  name: string;
  sector: string;
  stage: string;
  location: string;
  teamSize: number;
  lastFunding: number;
  lastFundingDate: string;
  totalFunding: number;
  valuation: number;
  confidence: number;
  trending: 'up' | 'down' | 'stable';
  keyMetrics: {
    revenue: number;
    growth: number;
    customers: number;
    runwayMonths: number;
  };
}

export function CapitalIQStyleScreener() {
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    stage: [],
    sector: [],
    geography: [],
    fundingRange: { min: 0, max: 50000000 },
    teamSize: { min: 1, max: 500 },
    ageRange: { min: 0, max: 10 },
    customMetrics: {}
  });

  const [results, setResults] = useState<CompanyResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'financial']);

  // Mock data for demonstration
  const mockResults: CompanyResult[] = [
    {
      id: '1',
      name: 'TechVenture AI',
      sector: 'Artificial Intelligence',
      stage: 'Series A',
      location: 'San Francisco, CA',
      teamSize: 45,
      lastFunding: 15000000,
      lastFundingDate: '2024-01-15',
      totalFunding: 22000000,
      valuation: 80000000,
      confidence: 87,
      trending: 'up',
      keyMetrics: {
        revenue: 2400000,
        growth: 180,
        customers: 127,
        runwayMonths: 24
      }
    },
    {
      id: '2',
      name: 'GreenTech Solutions',
      sector: 'CleanTech',
      stage: 'Seed',
      location: 'Austin, TX',
      teamSize: 18,
      lastFunding: 3500000,
      lastFundingDate: '2024-02-28',
      totalFunding: 5200000,
      valuation: 25000000,
      confidence: 72,
      trending: 'up',
      keyMetrics: {
        revenue: 450000,
        growth: 240,
        customers: 34,
        runwayMonths: 18
      }
    },
    {
      id: '3',
      name: 'FinanceFlow',
      sector: 'FinTech',
      stage: 'Series B',
      location: 'New York, NY',
      teamSize: 123,
      lastFunding: 35000000,
      lastFundingDate: '2023-11-10',
      totalFunding: 58000000,
      valuation: 180000000,
      confidence: 94,
      trending: 'stable',
      keyMetrics: {
        revenue: 8200000,
        growth: 125,
        customers: 2850,
        runwayMonths: 36
      }
    }
  ];

  useEffect(() => {
    setResults(mockResults);
  }, [criteria]);

  const formatCurrency = (value: number, compact = true) => {
    if (compact) {
      if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const addCriteria = (type: keyof ScreenerCriteria, value: string) => {
    if (Array.isArray(criteria[type])) {
      setCriteria(prev => ({
        ...prev,
        [type]: [...(prev[type] as string[]), value]
      }));
    }
  };

  const removeCriteria = (type: keyof ScreenerCriteria, value: string) => {
    if (Array.isArray(criteria[type])) {
      setCriteria(prev => ({
        ...prev,
        [type]: (prev[type] as string[]).filter(v => v !== value)
      }));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-900">Startup Screener</h1>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span>Universe:</span>
              <span className="font-semibold text-blue-600">12,847 Companies</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Screen
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Criteria */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Screening Criteria</h2>

            {/* Basic Criteria */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded"
                onClick={() => toggleSection('basic')}
              >
                <span className="font-medium text-slate-700">Basic Criteria</span>
                {expandedSections.includes('basic') ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </div>
              
              {expandedSections.includes('basic') && (
                <div className="ml-4 mt-2 space-y-4">
                  {/* Funding Stage */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Funding Stage
                    </label>
                    <div className="space-y-1">
                      {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'].map(stage => (
                        <label key={stage} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 mr-2"
                            checked={criteria.stage.includes(stage)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addCriteria('stage', stage);
                              } else {
                                removeCriteria('stage', stage);
                              }
                            }}
                          />
                          <span className="text-sm text-slate-700">{stage}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Sector
                    </label>
                    <div className="space-y-1">
                      {['AI/ML', 'FinTech', 'HealthTech', 'CleanTech', 'SaaS', 'E-commerce'].map(sector => (
                        <label key={sector} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 mr-2"
                            checked={criteria.sector.includes(sector)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addCriteria('sector', sector);
                              } else {
                                removeCriteria('sector', sector);
                              }
                            }}
                          />
                          <span className="text-sm text-slate-700">{sector}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Criteria */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded"
                onClick={() => toggleSection('financial')}
              >
                <span className="font-medium text-slate-700">Financial Metrics</span>
                {expandedSections.includes('financial') ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </div>
              
              {expandedSections.includes('financial') && (
                <div className="ml-4 mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Last Funding Amount
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                        value={criteria.fundingRange.min}
                        onChange={(e) => setCriteria(prev => ({
                          ...prev,
                          fundingRange: { ...prev.fundingRange, min: Number(e.target.value) }
                        }))}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                        value={criteria.fundingRange.max}
                        onChange={(e) => setCriteria(prev => ({
                          ...prev,
                          fundingRange: { ...prev.fundingRange, max: Number(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Team Size
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                        value={criteria.teamSize.min}
                        onChange={(e) => setCriteria(prev => ({
                          ...prev,
                          teamSize: { ...prev.teamSize, min: Number(e.target.value) }
                        }))}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                        value={criteria.teamSize.max}
                        onChange={(e) => setCriteria(prev => ({
                          ...prev,
                          teamSize: { ...prev.teamSize, max: Number(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Applied Filters */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-600 mb-2">Applied Filters</h3>
              <div className="space-y-1">
                {criteria.stage.map(stage => (
                  <div key={stage} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                    <span className="text-sm text-blue-700">Stage: {stage}</span>
                    <button 
                      onClick={() => removeCriteria('stage', stage)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {criteria.sector.map(sector => (
                  <div key={sector} className="flex items-center justify-between bg-green-50 px-2 py-1 rounded">
                    <span className="text-sm text-green-700">Sector: {sector}</span>
                    <button 
                      onClick={() => removeCriteria('sector', sector)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Run Screen ({results.length} Results)
            </Button>
          </div>
        </div>

        {/* Main Content - Results */}
        <div className="flex-1 flex flex-col">
          {/* Results Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Results ({results.length} companies)
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <span>Sort by:</span>
                <select className="border border-slate-300 rounded px-2 py-1">
                  <option>Last Funding Date</option>
                  <option>Funding Amount</option>
                  <option>Valuation</option>
                  <option>Confidence Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'list' ? (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Company</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Sector</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Stage</th>
                      <th className="text-right p-3 text-sm font-medium text-slate-600">Last Funding</th>
                      <th className="text-right p-3 text-sm font-medium text-slate-600">Valuation</th>
                      <th className="text-center p-3 text-sm font-medium text-slate-600">Confidence</th>
                      <th className="text-center p-3 text-sm font-medium text-slate-600">Trend</th>
                      <th className="text-center p-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((company, index) => (
                      <tr 
                        key={company.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50 ${
                          selectedCompanies.includes(company.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-blue-600"
                              checked={selectedCompanies.includes(company.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCompanies(prev => [...prev, company.id]);
                                } else {
                                  setSelectedCompanies(prev => prev.filter(id => id !== company.id));
                                }
                              }}
                            />
                            <div>
                              <div className="font-medium text-slate-900">{company.name}</div>
                              <div className="text-sm text-slate-500 flex items-center">
                                <Building2 className="w-3 h-3 mr-1" />
                                {company.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-slate-600">{company.sector}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {company.stage}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="text-sm font-medium text-slate-900">
                            {formatCurrency(company.lastFunding)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(company.lastFundingDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-3 text-right text-sm font-medium text-slate-900">
                          {formatCurrency(company.valuation)}
                        </td>
                        <td className="p-3 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            company.confidence >= 80 ? 'bg-green-100 text-green-800' :
                            company.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {company.confidence}%
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {company.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />}
                          {company.trending === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                          {company.trending === 'stable' && <div className="w-4 h-0.5 bg-gray-400 mx-auto"></div>}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Star className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(company => (
                  <Card key={company.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <p className="text-sm text-slate-600">{company.sector}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {company.stage}
                          </span>
                          {company.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Last Funding:</span>
                          <div className="font-medium">{formatCurrency(company.lastFunding)}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Valuation:</span>
                          <div className="font-medium">{formatCurrency(company.valuation)}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Team Size:</span>
                          <div className="font-medium">{company.teamSize}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Confidence:</span>
                          <div className="font-medium text-green-600">{company.confidence}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}