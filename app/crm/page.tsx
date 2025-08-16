'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export default function CRMPage() {
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

  const crmIntegrations = [
    {
      name: 'Airtable',
      status: 'connected',
      lastSync: '2 minutes ago',
      deals: 24,
      description: 'Syncing deal pipeline and contact information'
    },
    {
      name: 'Notion',
      status: 'disconnected',
      lastSync: 'Never',
      deals: 0,
      description: 'Connect to sync deal notes and documentation'
    },
    {
      name: 'HubSpot',
      status: 'error',
      lastSync: '1 hour ago',
      deals: 12,
      description: 'API rate limit exceeded, retrying...'
    },
    {
      name: 'Salesforce',
      status: 'connected',
      lastSync: '15 minutes ago',
      deals: 18,
      description: 'Syncing opportunities and account data'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM Integrations</h1>
          <p className="text-gray-600 mt-2">Manage your CRM connections and data synchronization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Synced Deals</p>
                <p className="text-3xl font-bold text-green-600">54</p>
              </div>
              <RefreshCw className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-3xl font-bold text-gray-900">2m</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">CRM Systems</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All
            </Button>
          </div>

          <div className="space-y-4">
            {crmIntegrations.map((crm, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{crm.name}</h3>
                    <p className="text-sm text-gray-600">{crm.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Last sync: {crm.lastSync}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{crm.deals} deals</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(crm.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crm.status)}`}>
                      {crm.status}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sync Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Auto-sync frequency</h3>
                <p className="text-sm text-gray-600">How often to sync data from CRM systems</p>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Every 15 minutes</option>
                <option>Every hour</option>
                <option>Every 4 hours</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Sync direction</h3>
                <p className="text-sm text-gray-600">How data should be synchronized</p>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Bidirectional</option>
                <option>Import only</option>
                <option>Export only</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}