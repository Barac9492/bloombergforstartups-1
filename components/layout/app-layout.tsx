'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { NotificationToast } from './notification-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="pt-16">
          {children}
        </main>
      </div>
      <NotificationToast />
    </div>
  );
}