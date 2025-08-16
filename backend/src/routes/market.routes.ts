import { Router } from 'express';
import { alphaVantageService } from '../services/financial/alpha-vantage.service';
import { realTimeDataService } from '../services/market/realtime-data.service';
import { logger } from '../utils/logger';

const router = Router();

// Get market indices
router.get('/indices', async (req, res) => {
  try {
    const indices = realTimeDataService.getMarketIndices();
    res.json(indices);
  } catch (error) {
    logger.error('Error fetching market indices:', error);
    res.status(500).json({ error: 'Failed to fetch market indices' });
  }
});

// Get real-time quote for a symbol
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await alphaVantageService.getStockQuote(symbol.toUpperCase());
    
    if (!quote) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    
    res.json(quote);
  } catch (error) {
    logger.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Get company overview
router.get('/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const overview = await alphaVantageService.getCompanyOverview(symbol.toUpperCase());
    
    if (!overview) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(overview);
  } catch (error) {
    logger.error('Error fetching company overview:', error);
    res.status(500).json({ error: 'Failed to fetch company overview' });
  }
});

// Get intraday data
router.get('/intraday/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '5min' } = req.query;
    
    const validIntervals = ['1min', '5min', '15min', '30min', '60min'];
    if (!validIntervals.includes(interval as string)) {
      return res.status(400).json({ error: 'Invalid interval' });
    }
    
    const data = await alphaVantageService.getIntradayData(
      symbol.toUpperCase(),
      interval as any
    );
    
    if (!data) {
      return res.status(404).json({ error: 'No intraday data found' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error('Error fetching intraday data:', error);
    res.status(500).json({ error: 'Failed to fetch intraday data' });
  }
});

// Search symbols
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await alphaVantageService.searchSymbols(query);
    res.json(results);
  } catch (error) {
    logger.error('Error searching symbols:', error);
    res.status(500).json({ error: 'Failed to search symbols' });
  }
});

// Get news
router.get('/news', async (req, res) => {
  try {
    const { symbols, topics, limit = '50' } = req.query;
    
    let symbolArray: string[] | undefined;
    let topicArray: string[] | undefined;
    
    if (symbols && typeof symbols === 'string') {
      symbolArray = symbols.split(',').map(s => s.trim());
    }
    
    if (topics && typeof topics === 'string') {
      topicArray = topics.split(',').map(t => t.trim());
    }
    
    const news = await alphaVantageService.getNews(symbolArray, topicArray);
    
    // Apply limit
    const limitNum = parseInt(limit as string);
    const limitedNews = news.slice(0, limitNum);
    
    res.json(limitedNews);
  } catch (error) {
    logger.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get startup valuations
router.get('/startups/valuations', async (req, res) => {
  try {
    const valuations = realTimeDataService.getStartupValuations();
    res.json(valuations);
  } catch (error) {
    logger.error('Error fetching startup valuations:', error);
    res.status(500).json({ error: 'Failed to fetch startup valuations' });
  }
});

// Get market data for specific symbol
router.get('/data/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = realTimeDataService.getMarketData(symbol.toUpperCase());
    
    if (!data) {
      return res.status(404).json({ error: 'No data found for symbol' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get service status
router.get('/status', (req, res) => {
  try {
    const status = realTimeDataService.getConnectionStatus();
    res.json({
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error fetching service status:', error);
    res.status(500).json({ error: 'Failed to fetch service status' });
  }
});

export { router as marketRoutes };