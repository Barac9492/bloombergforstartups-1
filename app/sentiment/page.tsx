'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';

export default function SentimentPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push('/');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sentimentData = [
    { name: 'TechCorp Deal', score: 0.85, trend: 'up', mentions: 142 },
    { name: 'StartupX Investment', score: 0.42, trend: 'down', mentions: 89 },
    { name: 'AI Venture Fund', score: 0.73, trend: 'up', mentions: 267 },
    { name: 'SaaS Platform B', score: 0.31, trend: 'down', mentions: 56 },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sentiment Analysis</h1>
          <p className="text-gray-600 mt-2">Real-time sentiment tracking for your deals and portfolio companies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Sentiment</p>
                <p className="text-3xl font-bold text-green-600">+0.64</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mentions</p>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positive Trends</p>
                <p className="text-3xl font-bold text-green-600">67%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Deal Sentiment Overview</h2>
          <div className="space-y-4">
            {sentimentData.map((deal, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{deal.name}</h3>
                    <p className="text-sm text-gray-600">{deal.mentions} mentions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      deal.score > 0.6 ? 'text-green-600' : 
                      deal.score > 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {deal.score.toFixed(2)}
                    </span>
                    {deal.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}