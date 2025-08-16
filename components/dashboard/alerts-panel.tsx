'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationStore } from '@/lib/stores/notifications';
import { AlertTriangle, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export function AlertsPanel() {
  const { notifications } = useNotificationStore();

  // Sample alerts for demonstration
  const sampleAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Sentiment Drop',
      message: 'TechStart Inc. showing negative sentiment trend',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: TrendingDown,
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Deal Stagnant',
      message: 'CloudCorp deal has been in "Negotiation" for 14 days',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      icon: Clock,
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'Automation Success',
      message: 'DataFlow deal automatically moved to "Proposal Sent"',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      icon: CheckCircle,
    },
  ];

  const allAlerts = [...notifications, ...sampleAlerts].slice(0, 10);

  const getAlertIcon = (type: string, customIcon?: any) => {
    if (customIcon) {
      const Icon = customIcon;
      return <Icon className="w-4 h-4" />;
    }
    
    switch (type) {
      case 'warning':
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>No alerts at the moment</p>
              <p className="text-sm">Everything looks good!</p>
            </div>
          ) : (
            allAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type, (alert as any).icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <p className="text-sm opacity-90 mt-1">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatRelativeTime(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}