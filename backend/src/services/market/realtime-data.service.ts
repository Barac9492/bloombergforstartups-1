import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger';
import { alphaVantageService } from '../financial/alpha-vantage.service';
import { crunchbaseService } from '../startup/crunchbase.service';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
}

export interface StartupValuation {
  companyId: string;
  name: string;
  valuation: number;
  change: number;
  lastUpdated: Date;
  stage: string;
  sector: string;
}

export interface MarketIndices {
  nasdaq: MarketData;
  sp500: MarketData;
  vix: MarketData;
  startupIndex: MarketData;
}

export interface FundingActivity {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  averageDealSize: number;
  topSectors: Array<{
    sector: string;
    amount: number;
    deals: number;
  }>;
  recentDeals: Array<{
    company: string;
    amount: number;
    stage: string;
    investors: string[];
    timestamp: Date;
  }>;
}

class RealTimeDataService extends EventEmitter {
  private wsConnections: Map<string, WebSocket> = new Map();
  private subscribers: Map<string, Set<string>> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private startupData: Map<string, StartupValuation> = new Map();
  private isConnected: boolean = false;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private dataUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeConnections();
    this.startDataUpdates();
  }

  private async initializeConnections() {
    try {
      // Initialize WebSocket connections to various data sources
      await this.connectToAlphaVantage();
      await this.connectToStartupDataSources();
      
      this.isConnected = true;
      logger.info('Real-time data service initialized');
      this.emit('connected');
    } catch (error) {
      logger.error('Failed to initialize real-time data service:', error);
      this.scheduleReconnect();
    }
  }

  private async connectToAlphaVantage() {
    // Alpha Vantage doesn't have real-time WebSocket, so we'll poll
    // In production, you'd connect to real WebSocket feeds like IEX Cloud, Twelve Data, etc.
    logger.info('Setting up Alpha Vantage data polling');
  }

  private async connectToStartupDataSources() {
    // Connect to startup-specific data sources
    // This could include Crunchbase real-time feeds, PitchBook API, etc.
    logger.info('Setting up startup data connections');
  }

  private startDataUpdates() {
    // Update market data every 5 seconds
    this.dataUpdateInterval = setInterval(async () => {
      await this.updateMarketData();
      await this.updateStartupData();
      await this.updateFundingActivity();
    }, 5000);
  }

  private async updateMarketData() {
    try {
      // Fetch major indices
      const symbols = ['QQQ', 'SPY', 'VIX', 'IWM']; // ETFs representing major indices
      
      for (const symbol of symbols) {
        const quote = await alphaVantageService.getStockQuote(symbol);
        if (quote) {
          const marketData: MarketData = {
            ...quote,
            timestamp: new Date(),
          };
          
          this.marketData.set(symbol, marketData);
          this.emit('marketData', { symbol, data: marketData });
        }
      }
    } catch (error) {
      logger.error('Error updating market data:', error);
    }
  }

  private async updateStartupData() {
    try {
      // Simulate startup valuation updates
      // In reality, this would come from various startup data sources
      const mockStartups = [
        { id: 'techflow-ai', name: 'TechFlow AI', valuation: 450000000, sector: 'AI', stage: 'Series B' },
        { id: 'quantumsecure', name: 'QuantumSecure', valuation: 120000000, sector: 'Cybersecurity', stage: 'Series A' },
        { id: 'biosynth-labs', name: 'BioSynth Labs', valuation: 800000000, sector: 'Biotech', stage: 'Series C' },
      ];

      for (const startup of mockStartups) {
        const change = (Math.random() - 0.5) * 0.1; // Random change -5% to +5%
        const newValuation = startup.valuation * (1 + change);
        
        const valuationData: StartupValuation = {
          companyId: startup.id,
          name: startup.name,
          valuation: newValuation,
          change: change * 100,
          lastUpdated: new Date(),
          stage: startup.stage,
          sector: startup.sector,
        };
        
        this.startupData.set(startup.id, valuationData);
        this.emit('startupData', { companyId: startup.id, data: valuationData });
      }
    } catch (error) {
      logger.error('Error updating startup data:', error);
    }
  }

  private async updateFundingActivity() {
    try {
      // Generate mock funding activity data
      // In reality, this would aggregate real funding data
      const fundingActivity: FundingActivity = {
        totalToday: Math.floor(Math.random() * 500000000) + 100000000,
        totalWeek: Math.floor(Math.random() * 2000000000) + 500000000,
        totalMonth: Math.floor(Math.random() * 8000000000) + 2000000000,
        averageDealSize: Math.floor(Math.random() * 50000000) + 10000000,
        topSectors: [
          { sector: 'AI/ML', amount: 125000000, deals: 8 },
          { sector: 'Fintech', amount: 98000000, deals: 12 },
          { sector: 'Biotech', amount: 87000000, deals: 6 },
          { sector: 'Climate', amount: 76000000, deals: 9 },
        ],
        recentDeals: [
          {
            company: 'AI Startup X',
            amount: 35000000,
            stage: 'Series B',
            investors: ['Sequoia', 'a16z'],
            timestamp: new Date(),
          },
          {
            company: 'FinTech Pro',
            amount: 25000000,
            stage: 'Series A',
            investors: ['Kleiner Perkins', 'GV'],
            timestamp: new Date(Date.now() - 3600000),
          },
        ],
      };
      
      this.emit('fundingActivity', fundingActivity);
    } catch (error) {
      logger.error('Error updating funding activity:', error);
    }
  }

  public subscribe(clientId: string, symbols: string[]) {
    for (const symbol of symbols) {
      if (!this.subscribers.has(symbol)) {
        this.subscribers.set(symbol, new Set());
      }
      this.subscribers.get(symbol)!.add(clientId);
    }
    
    // Send latest data immediately
    for (const symbol of symbols) {
      const data = this.marketData.get(symbol);
      if (data) {
        this.emit('marketData', { symbol, data, clientId });
      }
    }
  }

  public unsubscribe(clientId: string, symbols?: string[]) {
    if (symbols) {
      for (const symbol of symbols) {
        this.subscribers.get(symbol)?.delete(clientId);
      }
    } else {
      // Unsubscribe from all
      for (const subscribers of this.subscribers.values()) {
        subscribers.delete(clientId);
      }
    }
  }

  public getMarketIndices(): MarketIndices {
    return {
      nasdaq: this.marketData.get('QQQ') || this.createDefaultMarketData('QQQ'),
      sp500: this.marketData.get('SPY') || this.createDefaultMarketData('SPY'),
      vix: this.marketData.get('VIX') || this.createDefaultMarketData('VIX'),
      startupIndex: this.marketData.get('IWM') || this.createDefaultMarketData('IWM'),
    };
  }

  public getStartupValuations(): StartupValuation[] {
    return Array.from(this.startupData.values());
  }

  public getMarketData(symbol: string): MarketData | null {
    return this.marketData.get(symbol) || null;
  }

  public async searchSymbols(query: string) {
    try {
      return await alphaVantageService.searchSymbols(query);
    } catch (error) {
      logger.error('Error searching symbols:', error);
      return [];
    }
  }

  public async getCompanyData(identifier: string) {
    try {
      return await crunchbaseService.getCompanyDetails(identifier);
    } catch (error) {
      logger.error('Error fetching company data:', error);
      return null;
    }
  }

  private createDefaultMarketData(symbol: string): MarketData {
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      timestamp: new Date(),
    };
  }

  private scheduleReconnect() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    
    this.reconnectInterval = setTimeout(() => {
      logger.info('Attempting to reconnect to data sources...');
      this.initializeConnections();
    }, 30000); // Retry after 30 seconds
  }

  public disconnect() {
    this.isConnected = false;
    
    if (this.dataUpdateInterval) {
      clearInterval(this.dataUpdateInterval);
      this.dataUpdateInterval = null;
    }
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    // Close all WebSocket connections
    for (const ws of this.wsConnections.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
    
    this.wsConnections.clear();
    this.subscribers.clear();
    
    logger.info('Real-time data service disconnected');
  }

  public getConnectionStatus() {
    return {
      connected: this.isConnected,
      activeConnections: this.wsConnections.size,
      totalSubscribers: Array.from(this.subscribers.values()).reduce((sum, set) => sum + set.size, 0),
    };
  }
}

export const realTimeDataService = new RealTimeDataService();