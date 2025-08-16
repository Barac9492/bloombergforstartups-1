export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface Deal {
  id: string;
  name: string;
  company: string;
  description?: string;
  stage: string;
  value?: number;
  probability: number;
  contact?: string;
  email?: string;
  website?: string;
  notes?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  sentiments?: Sentiment[];
  activities?: Activity[];
  automations?: DealAutomation[];
}

export interface Sentiment {
  id: string;
  dealId: string;
  source: string;
  content?: string;
  url?: string;
  score: number;
  magnitude: number;
  category: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  analyzedAt: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  content: string;
  dealId: string;
  userId: string;
  createdAt: string;
  user?: {
    name?: string;
    email: string;
  };
}

export interface DealAutomation {
  id: string;
  dealId: string;
  trigger: string;
  condition: any;
  action: string;
  actionData: any;
  enabled: boolean;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentimentTrend {
  period: string;
  dataPoints: Array<{
    date: string;
    avgScore: number;
    count: number;
  }>;
  trends: {
    direction: 'positive' | 'negative' | 'neutral';
    strength: number;
    change: number;
  };
  prediction: {
    prediction: 'improving' | 'declining' | 'stable';
    confidence: number;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  deals: Deal[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export interface DealState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  createDeal: (deal: Partial<Deal>) => Promise<Deal>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<Deal>;
  deleteDeal: (id: string) => Promise<void>;
  moveDeal: (id: string, stage: string) => Promise<Deal>;
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}