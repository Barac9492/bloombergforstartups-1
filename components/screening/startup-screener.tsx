'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Star,
  Target,
  Zap,
  Globe
} from 'lucide-react';

interface ScreeningCriteria {
  sector: string[];
  stage: string[];
  minValuation: number;
  maxValuation: number;
  minFunding: number;
  maxFunding: number;
  minEmployees: number;
  maxEmployees: number;
  geography: string[];
  fundingDate: string;
  growth: string;
}

interface StartupResult {
  id: string;
  name: string;
  sector: string;
  stage: string;
  valuation: number;
  lastFunding: number;
  fundingDate: string;
  employees: number;
  location: string;
  description: string;
  growth: number;
  investors: string[];
  score: number;
  risk: 'Low' | 'Medium' | 'High';
}

export function StartupScreener() {
  const [criteria, setCriteria] = useState<ScreeningCriteria>({
    sector: [],
    stage: [],
    minValuation: 0,
    maxValuation: 10000000000,
    minFunding: 0,
    maxFunding: 1000000000,
    minEmployees: 0,
    maxEmployees: 10000,
    geography: [],
    fundingDate: '',
    growth: '',
  });

  const [results, setResults] = useState<StartupResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - in reality this would come from the screening API
  const mockResults: StartupResult[] = [
    {
      id: '1',
      name: 'TechFlow AI',
      sector: 'Artificial Intelligence',
      stage: 'Series B',
      valuation: 450000000,
      lastFunding: 75000000,
      fundingDate: '2024-01-15',
      employees: 180,
      location: 'San Francisco, CA',
      description: 'Enterprise AI automation platform',
      growth: 340,
      investors: ['Andreessen Horowitz', 'General Catalyst'],
      score: 92,
      risk: 'Low'
    },
    {
      id: '2',
      name: 'QuantumSecure',
      sector: 'Cybersecurity',
      stage: 'Series A',
      valuation: 120000000,
      lastFunding: 25000000,
      fundingDate: '2023-11-20',
      employees: 85,
      location: 'Austin, TX',
      description: 'Quantum-resistant encryption solutions',
      growth: 280,
      investors: ['Kleiner Perkins', 'CRV'],
      score: 88,
      risk: 'Medium'
    },
    {
      id: '3',
      name: 'BioSynth Labs',
      sector: 'Biotechnology',
      stage: 'Series C',
      valuation: 800000000,
      lastFunding: 120000000,
      fundingDate: '2024-02-10',
      employees: 250,
      location: 'Boston, MA',
      description: 'Synthetic biology for drug discovery',
      growth: 190,
      investors: ['GV', 'NEA', 'Flagship Pioneering'],
      score: 85,
      risk: 'Medium'
    },
    {
      id: '4',
      name: 'GreenEnergy Solutions',
      sector: 'Clean Technology',
      stage: 'Series B',
      valuation: 320000000,
      lastFunding: 60000000,
      fundingDate: '2023-12-05',
      employees: 140,
      location: 'Denver, CO',
      description: 'Next-gen solar panel technology',
      growth: 150,
      investors: ['Breakthrough Energy Ventures', 'Energy Impact Partners'],
      score: 82,
      risk: 'Low'
    },
    {
      id: '5',
      name: 'FinTech Pro',
      sector: 'Financial Services',
      stage: 'Series A',
      valuation: 180000000,
      lastFunding: 35000000,
      fundingDate: '2024-01-28',
      employees: 95,
      location: 'New York, NY',
      description: 'AI-powered trading algorithms',
      growth: 220,
      investors: ['Sequoia Capital', 'Index Ventures'],
      score: 79,
      risk: 'High'
    }
  ];

  const sectors = [
    'Artificial Intelligence',
    'Biotechnology',
    'Clean Technology',
    'Cybersecurity',
    'Financial Services',
    'Healthcare',
    'E-commerce',
    'SaaS',
    'Enterprise Software',
    'Consumer Tech'
  ];

  const stages = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
    'IPO Ready'
  ];

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Boston, MA',
    'Austin, TX',
    'Seattle, WA',
    'Los Angeles, CA',
    'London, UK',
    'Berlin, Germany',
    'Tel Aviv, Israel',
    'Singapore'
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const handleScreen = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = mockResults;
      
      // Apply filters
      if (criteria.sector.length > 0) {
        filtered = filtered.filter(company => criteria.sector.includes(company.sector));
      }
      
      if (criteria.stage.length > 0) {
        filtered = filtered.filter(company => criteria.stage.includes(company.stage));
      }
      
      filtered = filtered.filter(company => 
        company.valuation >= criteria.minValuation && 
        company.valuation <= criteria.maxValuation
      );
      
      filtered = filtered.filter(company => 
        company.lastFunding >= criteria.minFunding && 
        company.lastFunding <= criteria.maxFunding
      );
      
      // Sort results
      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof StartupResult];
        const bVal = b[sortBy as keyof StartupResult];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        }
        
        return sortOrder === 'desc' 
          ? String(bVal).localeCompare(String(aVal))
          : String(aVal).localeCompare(String(bVal));
      });
      
      setResults(filtered);
      setIsLoading(false);
    }, 1000);
  };

  const handleCriteriaChange = (field: keyof ScreeningCriteria, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayValue = (field: 'sector' | 'stage' | 'geography', value: string) => {
    setCriteria(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  useEffect(() => {
    // Load initial results
    setResults(mockResults);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Startup Screener</h1>
          <p className="text-gray-600">CapitalIQ-style screening for startup investments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button onClick={handleScreen} disabled={isLoading}>
            <Filter className="h-4 w-4 mr-2" />
            {isLoading ? 'Screening...' : 'Run Screen'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Screening Criteria */}
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Screening Criteria</h2>
          
          <div className="space-y-6">
            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sectors.map(sector => (
                  <label key={sector} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={criteria.sector.includes(sector)}
                      onChange={() => toggleArrayValue('sector', sector)}
                      className="mr-2"
                    />
                    <span className="text-sm">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
              <div className="space-y-2">
                {stages.map(stage => (
                  <label key={stage} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={criteria.stage.includes(stage)}
                      onChange={() => toggleArrayValue('stage', stage)}
                      className="mr-2"
                    />
                    <span className="text-sm">{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Valuation Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Range</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min Valuation"
                  value={criteria.minValuation || ''}
                  onChange={(e) => handleCriteriaChange('minValuation', Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Max Valuation"
                  value={criteria.maxValuation === 10000000000 ? '' : criteria.maxValuation}
                  onChange={(e) => handleCriteriaChange('maxValuation', Number(e.target.value) || 10000000000)}
                />
              </div>
            </div>

            {/* Funding Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Funding Range</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min Funding"
                  value={criteria.minFunding || ''}
                  onChange={(e) => handleCriteriaChange('minFunding', Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Max Funding"
                  value={criteria.maxFunding === 1000000000 ? '' : criteria.maxFunding}
                  onChange={(e) => handleCriteriaChange('maxFunding', Number(e.target.value) || 1000000000)}
                />
              </div>
            </div>

            {/* Employee Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min Employees"
                  value={criteria.minEmployees || ''}
                  onChange={(e) => handleCriteriaChange('minEmployees', Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Max Employees"
                  value={criteria.maxEmployees === 10000 ? '' : criteria.maxEmployees}
                  onChange={(e) => handleCriteriaChange('maxEmployees', Number(e.target.value) || 10000)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="col-span-3 space-y-4">
          {/* Results Header */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                {results.length} companies found
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="score">Score</option>
                    <option value="valuation">Valuation</option>
                    <option value="lastFunding">Last Funding</option>
                    <option value="growth">Growth Rate</option>
                    <option value="employees">Employee Count</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {sortOrder === 'desc' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector/Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valuation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Funding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.location}</div>
                          <div className="text-xs text-gray-400 max-w-xs truncate">{company.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.sector}</div>
                        <div className="text-sm text-gray-500">{company.stage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(company.valuation)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(company.lastFunding)}
                        </div>
                        <div className="text-xs text-gray-500">{company.fundingDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          +{company.growth}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ${getScoreColor(company.score)}`}>
                          {company.score}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(company.risk)}`}>
                          {company.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}