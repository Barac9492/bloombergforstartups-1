import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/stores/auth';
import { useDealsStore } from '@/lib/stores/deals';
import { useNotificationStore } from '@/lib/stores/notifications';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { fetchDeals } = useDealsStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Create socket connection
    socketRef.current = io(WS_URL, {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      socket.emit('join-room', user.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    // Deal events
    socket.on('deal-created', () => {
      fetchDeals();
      addNotification({
        type: 'success',
        title: 'Deal Created',
        message: 'A new deal has been added to the pipeline.',
      });
    });

    socket.on('deal-updated', () => {
      fetchDeals();
    });

    socket.on('deal-deleted', () => {
      fetchDeals();
      addNotification({
        type: 'info',
        title: 'Deal Deleted',
        message: 'A deal has been removed from the pipeline.',
      });
    });

    socket.on('deal-moved', (data: { dealId: string; stage: string; automated?: boolean }) => {
      fetchDeals();
      if (data.automated) {
        addNotification({
          type: 'info',
          title: 'Deal Moved Automatically',
          message: `A deal has been automatically moved to ${data.stage}.`,
        });
      }
    });

    // Sentiment events
    socket.on('sentiment-alert', (data: { dealId: string; type: string; message: string; score: number }) => {
      addNotification({
        type: 'warning',
        title: 'Sentiment Alert',
        message: data.message,
      });
    });

    // Automation events
    socket.on('automation-notification', (data: { dealId: string; dealName: string; message: string; type: string }) => {
      addNotification({
        type: data.type as any,
        title: 'Automation Triggered',
        message: data.message,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, fetchDeals, addNotification]);

  return socketRef.current;
}