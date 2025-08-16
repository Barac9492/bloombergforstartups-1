'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, Target, TrendingUp, AlertTriangle, CheckCircle,
  Zap, Shield, Eye, Database, Network, Code, Globe
} from 'lucide-react';

interface IntelligenceMetrics {
  confidenceScore: number;
  estimatedMetrics: {
    companySize: number;
    fundingStage: string;
    marketTraction: number;
    technicalStrength: number;
    teamQuality: number;
    marketTiming: number;
  };
  dataPoints: number;
  recommendations: string[];
  riskFactors: string[];
}

export function IntelligencePanel() {
  const [intelligence, setIntelligence] = useState<IntelligenceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI intelligence gathering
    const mockIntelligence: IntelligenceMetrics = {
      confidenceScore: 78,
      estimatedMetrics: {
        companySize: 12,
        fundingStage: 'Series A',
        marketTraction: 65,
        technicalStrength: 82,
        teamQuality: 71,
        marketTiming: 89
      },
      dataPoints: 147,
      recommendations: [
        'Strong technical foundation detected',
        'Market timing highly favorable',
        'Consider accelerated due diligence'
      ],
      riskFactors: [
        'Limited customer validation data',
        'Competitive landscape intensifying'
      ]
    };

    setTimeout(() => {
      setIntelligence(mockIntelligence);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Card className="glass border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-gradient">AI Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-4 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!intelligence) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceRing = (score: number) => {
    const circumference = 2 * Math.PI * 18;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return { strokeDasharray, strokeDashoffset };
  };

  return (
    <Card className="glass border-blue-200/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600"></div>
      </div>

      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="w-5 h-5 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-gradient font-bold">AI Intelligence</span>
          </div>
          
          {/* Confidence Score Visualization */}
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-slate-200"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"
                className="text-blue-600 transition-all duration-1000"
                {...getConfidenceRing(intelligence.confidenceScore)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700">
                {intelligence.confidenceScore}%
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center">
                <Code className="w-3 h-3 mr-1" />
                Technical
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(intelligence.estimatedMetrics.technicalStrength)}`}>
                {intelligence.estimatedMetrics.technicalStrength}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center">
                <Target className="w-3 h-3 mr-1" />
                Traction
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(intelligence.estimatedMetrics.marketTraction)}`}>
                {intelligence.estimatedMetrics.marketTraction}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center">
                <Network className="w-3 h-3 mr-1" />
                Team
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(intelligence.estimatedMetrics.teamQuality)}`}>
                {intelligence.estimatedMetrics.teamQuality}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Timing
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(intelligence.estimatedMetrics.marketTiming)}`}>
                {intelligence.estimatedMetrics.marketTiming}%
              </span>
            </div>
          </div>
        </div>

        {/* Funding Stage Indicator */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Estimated Stage</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-blue-700">
              {intelligence.estimatedMetrics.fundingStage}
            </span>
            <span className="text-xs text-slate-500">
              ({intelligence.estimatedMetrics.companySize} employees)
            </span>
          </div>
        </div>

        {/* Data Points Indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-600">
            <Database className="w-4 h-4" />
            <span>Data Sources</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium text-slate-700">{intelligence.dataPoints}</span>
            <span className="text-slate-500">signals</span>
          </div>
        </div>

        {/* Recommendations */}
        {intelligence.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>AI Recommendations</span>
            </div>
            <div className="space-y-1">
              {intelligence.recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="text-xs text-slate-600 bg-green-50 p-2 rounded border-l-2 border-green-300">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {intelligence.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Risk Factors</span>
            </div>
            <div className="space-y-1">
              {intelligence.riskFactors.slice(0, 2).map((risk, index) => (
                <div key={index} className="text-xs text-slate-600 bg-amber-50 p-2 rounded border-l-2 border-amber-300">
                  {risk}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time indicator */}
        <div className="flex items-center justify-center pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Eye className="w-3 h-3" />
            <span>Live intelligence • Updated 2m ago</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}