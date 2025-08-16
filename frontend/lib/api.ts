import axios from 'axios';
import { Deal, Sentiment, SentimentTrend, Activity } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // For personal use, use the test token we created
  const personalToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWVkanIwd3EwMDAwNmhtczd4Z2s0amZ1IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1MzA1Nzk2LCJleHAiOjE3NTU5MTA1OTZ9.66FPQfcamRLtiPAadBbTsjDOi3ut9FrnFPKhny5rBds';
  const token = localStorage.getItem('auth-token') || personalToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

// Deals API
export const dealsAPI = {
  getDeals: async (): Promise<Deal[]> => {
    const response = await api.get('/deals');
    return response.data;
  },
  getDeal: async (id: string): Promise<Deal> => {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  },
  createDeal: async (deal: Partial<Deal>): Promise<Deal> => {
    const response = await api.post('/deals', deal);
    return response.data;
  },
  updateDeal: async (id: string, updates: Partial<Deal>): Promise<Deal> => {
    const response = await api.put(`/deals/${id}`, updates);
    return response.data;
  },
  deleteDeal: async (id: string): Promise<void> => {
    await api.delete(`/deals/${id}`);
  },
  moveDeal: async (id: string, stage: string): Promise<Deal> => {
    const response = await api.put(`/deals/${id}/move`, { stage });
    return response.data;
  },
  getActivities: async (dealId: string): Promise<Activity[]> => {
    const response = await api.get(`/deals/${dealId}/activities`);
    return response.data;
  },
  addActivity: async (dealId: string, activity: { type: string; content: string }): Promise<Activity> => {
    const response = await api.post(`/deals/${dealId}/activities`, activity);
    return response.data;
  },
};

// Sentiment API
export const sentimentAPI = {
  getDealSentiment: async (dealId: string): Promise<Sentiment[]> => {
    const response = await api.get(`/sentiment/${dealId}`);
    return response.data;
  },
  analyzeSentiment: async (dealId: string, sources: string[]): Promise<Sentiment[]> => {
    const response = await api.post('/sentiment/analyze', { dealId, sources });
    return response.data;
  },
  getSentimentTrends: async (dealId: string, period: string = '7d'): Promise<SentimentTrend> => {
    const response = await api.get(`/sentiment/trends/${dealId}?period=${period}`);
    return response.data;
  },
  batchAnalyze: async (): Promise<{ analyzed: number }> => {
    const response = await api.post('/sentiment/batch-analyze');
    return response.data;
  },
};

// CRM API
export const crmAPI = {
  importFromCRM: async (type: string, config: any) => {
    const response = await api.post(`/crm/import/${type}`, { config });
    return response.data;
  },
  exportToCRM: async (type: string, dealIds: string[], config: any) => {
    const response = await api.post(`/crm/export/${type}`, { dealIds, config });
    return response.data;
  },
  getSyncStatus: async () => {
    const response = await api.get('/crm/sync-status');
    return response.data;
  },
  configureCRM: async (type: string, config: any) => {
    const response = await api.post(`/crm/configure/${type}`, { config });
    return response.data;
  },
};