'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDealsStore } from '@/lib/stores/deals';
import { dealsAPI } from '@/lib/api';
import { Activity } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { MessageSquare, Calendar, Phone, Mail, FileText, TrendingUp } from 'lucide-react';

export function RecentActivity() {
  const { deals } = useDealsStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      if (deals.length === 0) return;

      try {
        // Fetch activities for the first few deals
        const activitiesPromises = deals.slice(0, 5).map(deal =>
          dealsAPI.getActivities(deal.id).catch(() => [])
        );
        
        const allActivities = await Promise.all(activitiesPromises);
        const flatActivities = allActivities.flat();
        
        // Sort by creation date and take the most recent
        const sortedActivities = flatActivities
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
          
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Generate mock activities for demonstration
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'email',
            content: 'Sent follow-up email to TechStart Inc.',
            dealId: deals[0]?.id || '1',
            userId: '1',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            user: { name: 'John Doe', email: 'john@company.com' }
          },
          {
            id: '2',
            type: 'call',
            content: 'Discovery call with CloudCorp - 45 minutes',
            dealId: deals[1]?.id || '2',
            userId: '1',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            user: { name: 'Jane Smith', email: 'jane@company.com' }
          },
          {
            id: '3',
            type: 'stage_change',
            content: 'Deal moved to Negotiation',
            dealId: deals[0]?.id || '1',
            userId: '1',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            user: { name: 'John Doe', email: 'john@company.com' }
          },
        ];
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, [deals]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'stage_change':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-600 bg-blue-100';
      case 'call':
        return 'text-green-600 bg-green-100';
      case 'meeting':
        return 'text-purple-600 bg-purple-100';
      case 'note':
        return 'text-gray-600 bg-gray-100';
      case 'stage_change':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here as you work on deals</p>
            </div>
          ) : (
            activities.map((activity) => {
              const deal = deals.find(d => d.id === activity.dealId);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{activity.user?.name || 'Unknown User'}</span>
                      {deal && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{deal.name}</span>
                        </>
                      )}
                      <span className="mx-1">•</span>
                      <span>{formatRelativeTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}