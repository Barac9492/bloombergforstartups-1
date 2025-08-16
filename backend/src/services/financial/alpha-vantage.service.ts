import axios from 'axios';
import { logger } from '../../utils/logger';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  timestamp: Date;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  bookValue: number;
  dividendYield: number;
  eps: number;
  revenuePerShare: number;
  profitMargin: number;
  operatingMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  revenue: number;
  grossProfit: number;
  ebitda: number;
  quarterlyEarningsGrowth: number;
  quarterlyRevenueGrowth: number;
}

export interface NewsItem {
  title: string;
  url: string;
  timePublished: string;
  authors: string[];
  summary: string;
  bannerImage: string;
  source: string;
  categoryWithinSource: string;
  sourceDomain: string;
  topics: Array<{
    topic: string;
    relevanceScore: string;
  }>;
  overallSentimentScore: number;
  overallSentimentLabel: string;
  tickerSentiment: Array<{
    ticker: string;
    relevanceScore: string;
    tickerSentimentScore: string;
    tickerSentimentLabel: string;
  }>;
}

class AlphaVantageService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.alphavantage.co/query';

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('Alpha Vantage API key not configured');
    }
  }

  async getStockQuote(symbol: string): Promise<StockData | null> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey,
        },
      });

      const quote = response.data['Global Quote'];
      if (!quote) {
        logger.warn(`No quote data found for symbol: ${symbol}`);
        return null;
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error fetching stock quote:', error);
      return null;
    }
  }

  async getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: this.apiKey,
        },
      });

      const data = response.data;
      if (!data || !data.Symbol) {
        logger.warn(`No overview data found for symbol: ${symbol}`);
        return null;
      }

      return {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description,
        sector: data.Sector,
        industry: data.Industry,
        marketCap: parseInt(data.MarketCapitalization) || 0,
        peRatio: parseFloat(data.PERatio) || 0,
        pegRatio: parseFloat(data.PEGRatio) || 0,
        bookValue: parseFloat(data.BookValue) || 0,
        dividendYield: parseFloat(data.DividendYield) || 0,
        eps: parseFloat(data.EPS) || 0,
        revenuePerShare: parseFloat(data.RevenuePerShareTTM) || 0,
        profitMargin: parseFloat(data.ProfitMargin) || 0,
        operatingMargin: parseFloat(data.OperatingMarginTTM) || 0,
        returnOnAssets: parseFloat(data.ReturnOnAssetsTTM) || 0,
        returnOnEquity: parseFloat(data.ReturnOnEquityTTM) || 0,
        revenue: parseInt(data.RevenueTTM) || 0,
        grossProfit: parseInt(data.GrossProfitTTM) || 0,
        ebitda: parseInt(data.EBITDA) || 0,
        quarterlyEarningsGrowth: parseFloat(data.QuarterlyEarningsGrowthYOY) || 0,
        quarterlyRevenueGrowth: parseFloat(data.QuarterlyRevenueGrowthYOY) || 0,
      };
    } catch (error) {
      logger.error('Error fetching company overview:', error);
      return null;
    }
  }

  async getNews(symbols?: string[], topics?: string[]): Promise<NewsItem[]> {
    try {
      const params: any = {
        function: 'NEWS_SENTIMENT',
        apikey: this.apiKey,
        limit: 50,
      };

      if (symbols && symbols.length > 0) {
        params.tickers = symbols.join(',');
      }

      if (topics && topics.length > 0) {
        params.topics = topics.join(',');
      }

      const response = await axios.get(this.baseUrl, { params });

      const feed = response.data.feed;
      if (!feed) {
        logger.warn('No news feed data found');
        return [];
      }

      return feed.map((item: any) => ({
        title: item.title,
        url: item.url,
        timePublished: item.time_published,
        authors: item.authors || [],
        summary: item.summary,
        bannerImage: item.banner_image,
        source: item.source,
        categoryWithinSource: item.category_within_source,
        sourceDomain: item.source_domain,
        topics: item.topics || [],
        overallSentimentScore: parseFloat(item.overall_sentiment_score) || 0,
        overallSentimentLabel: item.overall_sentiment_label || 'neutral',
        tickerSentiment: item.ticker_sentiment || [],
      }));
    } catch (error) {
      logger.error('Error fetching news:', error);
      return [];
    }
  }

  async getIntradayData(symbol: string, interval: '1min' | '5min' | '15min' | '30min' | '60min' = '5min') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: this.apiKey,
          outputsize: 'compact',
        },
      });

      const timeSeries = response.data[`Time Series (${interval})`];
      if (!timeSeries) {
        logger.warn(`No intraday data found for symbol: ${symbol}`);
        return null;
      }

      return Object.entries(timeSeries).map(([timestamp, data]: [string, any]) => ({
        timestamp: new Date(timestamp),
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume']),
      }));
    } catch (error) {
      logger.error('Error fetching intraday data:', error);
      return null;
    }
  }

  async searchSymbols(keywords: string) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords,
          apikey: this.apiKey,
        },
      });

      const matches = response.data.bestMatches;
      if (!matches) {
        return [];
      }

      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore']),
      }));
    } catch (error) {
      logger.error('Error searching symbols:', error);
      return [];
    }
  }
}

export const alphaVantageService = new AlphaVantageService();