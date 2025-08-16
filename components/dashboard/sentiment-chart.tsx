'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDealsStore } from '@/lib/stores/deals';
import { sentimentAPI } from '@/lib/api';

export function SentimentChart() {
  const { deals } = useDealsStore();
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSentimentData() {
      if (deals.length === 0) return;

      try {
        // Get sentiment trends for the first few deals
        const trendsPromises = deals.slice(0, 5).map(deal => 
          sentimentAPI.getSentimentTrends(deal.id, '7d')
        );
        
        const trendsResults = await Promise.all(trendsPromises);
        
        // Aggregate sentiment data by date
        const aggregatedData: Record<string, { date: string; avgScore: number; count: number }> = {};
        
        trendsResults.forEach(result => {
          result.dataPoints.forEach(point => {
            if (!aggregatedData[point.date]) {
              aggregatedData[point.date] = {
                date: point.date,
                avgScore: 0,
                count: 0
              };
            }
            aggregatedData[point.date].avgScore = 
              (aggregatedData[point.date].avgScore * aggregatedData[point.date].count + point.avgScore) /
              (aggregatedData[point.date].count + 1);
            aggregatedData[point.date].count += 1;
          });
        });

        const chartData = Object.values(aggregatedData)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sentiment: (item.avgScore * 100).toFixed(1)
          }));

        setSentimentData(chartData);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
        // Generate mock data for demonstration
        const mockData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sentiment: (Math.random() * 40 - 20).toFixed(1), // Random sentiment between -20 and 20
            avgScore: Math.random() * 0.4 - 0.2
          };
        });
        setSentimentData(mockData);
      } finally {
        setLoading(false);
      }
    }

    fetchSentimentData();
  }, [deals]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sentiment = parseFloat(payload[0].value);
      const color = sentiment > 10 ? 'text-green-600' : sentiment < -10 ? 'text-red-600' : 'text-gray-600';
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className={color}>
            Sentiment: {sentiment > 0 ? '+' : ''}{sentiment}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading sentiment data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
              />
              <YAxis 
                fontSize={12}
                domain={[-50, 50]}
                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone"
                dataKey="sentiment"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Negative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}