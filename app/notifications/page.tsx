'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, TrendingUp, Mail } from 'lucide-react';

export default function NotificationsPage() {
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

  const notifications = [
    {
      id: 1,
      type: 'sentiment_alert',
      title: 'Sentiment Alert: TechCorp Deal',
      message: 'Negative sentiment spike detected (+45% negative mentions)',
      time: '5 minutes ago',
      read: false,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 2,
      type: 'deal_update',
      title: 'Deal Stage Changed',
      message: 'StartupX Investment moved to Due Diligence',
      time: '1 hour ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'sentiment_positive',
      title: 'Positive Trend Alert',
      message: 'AI Venture Fund showing strong positive sentiment',
      time: '2 hours ago',
      read: true,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'system',
      title: 'CRM Sync Complete',
      message: 'Successfully synced 24 deals from Airtable',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated on your deals and sentiment alerts</p>
            </div>
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-3xl font-bold text-blue-600">4</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900">15</p>
              </div>
              <Bell className="h-8 w-8 text-gray-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <notification.icon className={`h-6 w-6 mt-1 ${notification.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Sentiment Alerts</p>
                      <p className="text-sm text-gray-600">Get notified of significant sentiment changes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Deal Updates</p>
                      <p className="text-sm text-gray-600">Notifications when deals change stages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">System Updates</p>
                      <p className="text-sm text-gray-600">CRM sync status and system notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">In-App Notifications</p>
                      <p className="text-sm text-gray-600">Show notifications in the application</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Send notifications via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}