'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Key, Database, Bell, Shield, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuthStore();
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

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input defaultValue={user?.name || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input defaultValue={user?.email || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Input defaultValue={user?.role || 'USER'} disabled />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <Input type="password" />
                </div>
                <Button variant="outline" className="w-full">
                  Update Password
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Token</label>
                  <Input type="password" placeholder="ghp_xxxxxxxxxxxx" />
                  <p className="text-xs text-gray-500 mt-1">Used for sentiment analysis from GitHub</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter API Key</label>
                  <Input type="password" placeholder="Bearer xxxxxxxxxx" />
                  <p className="text-xs text-gray-500 mt-1">Required for Twitter sentiment tracking</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Token</label>
                  <Input type="password" placeholder="AQXxxxxxxxxxx" />
                  <p className="text-xs text-gray-500 mt-1">For LinkedIn company monitoring</p>
                </div>
                <Button variant="outline" className="w-full">
                  Save API Keys
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-refresh Dashboard</p>
                    <p className="text-sm text-gray-600">Automatically refresh data every 5 minutes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Data Collection</p>
                    <p className="text-sm text-gray-600">Allow anonymous usage analytics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <LogOut className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Session</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Logged in as: {user?.email}</p>
                  <p className="text-sm text-gray-600 mb-4">Session expires: Never (Personal Mode)</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Personal Mode Active</h3>
              <p className="text-sm text-blue-700">
                This instance is configured for personal use with simplified authentication. 
                Some enterprise features may not be available.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}