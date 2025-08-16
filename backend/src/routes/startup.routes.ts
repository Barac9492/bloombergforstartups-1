import { Router } from 'express';
import { crunchbaseService } from '../services/startup/crunchbase.service';
import { logger } from '../utils/logger';

const router = Router();

// Search companies
router.get('/search', async (req, res) => {
  try {
    const { query, limit = '20' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const limitNum = parseInt(limit as string);
    const companies = await crunchbaseService.searchCompanies(query, limitNum);
    
    res.json(companies);
  } catch (error) {
    logger.error('Error searching companies:', error);
    res.status(500).json({ error: 'Failed to search companies' });
  }
});

// Get company details
router.get('/company/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const company = await crunchbaseService.getCompanyDetails(identifier);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    logger.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

// Get funding rounds for a company
router.get('/company/:identifier/funding', async (req, res) => {
  try {
    const { identifier } = req.params;
    const fundingRounds = await crunchbaseService.getFundingRounds(identifier);
    
    res.json(fundingRounds);
  } catch (error) {
    logger.error('Error fetching funding rounds:', error);
    res.status(500).json({ error: 'Failed to fetch funding rounds' });
  }
});

// Get investment trends
router.get('/trends', async (req, res) => {
  try {
    const { period = 'quarterly' } = req.query;
    
    const validPeriods = ['monthly', 'quarterly', 'yearly'];
    if (!validPeriods.includes(period as string)) {
      return res.status(400).json({ error: 'Invalid period. Must be monthly, quarterly, or yearly' });
    }
    
    const trends = await crunchbaseService.getInvestmentTrends(period as any);
    res.json(trends);
  } catch (error) {
    logger.error('Error fetching investment trends:', error);
    res.status(500).json({ error: 'Failed to fetch investment trends' });
  }
});

// Search investors
router.get('/investors/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const investors = await crunchbaseService.searchInvestors(
      query,
      type as string | undefined
    );
    
    res.json(investors);
  } catch (error) {
    logger.error('Error searching investors:', error);
    res.status(500).json({ error: 'Failed to search investors' });
  }
});

// Get investor portfolio
router.get('/investors/:investorId/portfolio', async (req, res) => {
  try {
    const { investorId } = req.params;
    const portfolio = await crunchbaseService.getInvestorPortfolio(investorId);
    
    res.json(portfolio);
  } catch (error) {
    logger.error('Error fetching investor portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch investor portfolio' });
  }
});

// Screen companies based on criteria
router.post('/screen', async (req, res) => {
  try {
    const {
      sectors,
      stages,
      minValuation,
      maxValuation,
      minFunding,
      maxFunding,
      minEmployees,
      maxEmployees,
      geography,
      fundingDateAfter,
      fundingDateBefore,
      limit = 50
    } = req.body;

    // This would typically involve complex database queries
    // For now, we'll return mock data based on the search criteria
    
    const mockResults = [
      {
        id: '1',
        name: 'TechFlow AI',
        sector: 'Artificial Intelligence',
        stage: 'Series B',
        valuation: 450000000,
        lastFunding: 75000000,
        fundingDate: '2024-01-15',
        employees: 180,
        location: 'San Francisco, CA',
        description: 'Enterprise AI automation platform',
        growth: 340,
        investors: ['Andreessen Horowitz', 'General Catalyst'],
        score: 92,
        risk: 'Low'
      },
      {
        id: '2',
        name: 'QuantumSecure',
        sector: 'Cybersecurity',
        stage: 'Series A',
        valuation: 120000000,
        lastFunding: 25000000,
        fundingDate: '2023-11-20',
        employees: 85,
        location: 'Austin, TX',
        description: 'Quantum-resistant encryption solutions',
        growth: 280,
        investors: ['Kleiner Perkins', 'CRV'],
        score: 88,
        risk: 'Medium'
      }
    ];

    // Apply filters
    let filtered = mockResults;
    
    if (sectors && sectors.length > 0) {
      filtered = filtered.filter(company => sectors.includes(company.sector));
    }
    
    if (stages && stages.length > 0) {
      filtered = filtered.filter(company => stages.includes(company.stage));
    }
    
    if (minValuation !== undefined) {
      filtered = filtered.filter(company => company.valuation >= minValuation);
    }
    
    if (maxValuation !== undefined) {
      filtered = filtered.filter(company => company.valuation <= maxValuation);
    }
    
    if (minFunding !== undefined) {
      filtered = filtered.filter(company => company.lastFunding >= minFunding);
    }
    
    if (maxFunding !== undefined) {
      filtered = filtered.filter(company => company.lastFunding <= maxFunding);
    }
    
    if (minEmployees !== undefined) {
      filtered = filtered.filter(company => company.employees >= minEmployees);
    }
    
    if (maxEmployees !== undefined) {
      filtered = filtered.filter(company => company.employees <= maxEmployees);
    }

    // Apply limit
    const limitedResults = filtered.slice(0, parseInt(limit as string));
    
    res.json({
      total: filtered.length,
      results: limitedResults,
      criteria: req.body
    });
  } catch (error) {
    logger.error('Error screening companies:', error);
    res.status(500).json({ error: 'Failed to screen companies' });
  }
});

// Get market sectors analysis
router.get('/sectors', async (req, res) => {
  try {
    // Mock sector analysis data
    const sectors = [
      {
        name: 'Artificial Intelligence',
        totalCompanies: 1247,
        totalFunding: 15600000000,
        averageValuation: 125000000,
        topCompanies: ['OpenAI', 'Anthropic', 'Scale AI'],
        growth: 45.2,
        riskLevel: 'Medium'
      },
      {
        name: 'Fintech',
        totalCompanies: 2156,
        totalFunding: 22300000000,
        averageValuation: 98000000,
        topCompanies: ['Stripe', 'Plaid', 'Chime'],
        growth: 32.1,
        riskLevel: 'Low'
      },
      {
        name: 'Healthcare Tech',
        totalCompanies: 1834,
        totalFunding: 18900000000,
        averageValuation: 156000000,
        topCompanies: ['Tempus', '10x Genomics', 'Veracyte'],
        growth: 28.7,
        riskLevel: 'Medium'
      }
    ];
    
    res.json(sectors);
  } catch (error) {
    logger.error('Error fetching sector analysis:', error);
    res.status(500).json({ error: 'Failed to fetch sector analysis' });
  }
});

// Get funding statistics
router.get('/funding/stats', async (req, res) => {
  try {
    const { period = 'ytd' } = req.query;
    
    // Mock funding statistics
    const stats = {
      period,
      totalFunding: 108500000000,
      totalDeals: 4200,
      averageDealSize: 25800000,
      medianDealSize: 8500000,
      topStages: [
        { stage: 'Series A', deals: 1250, amount: 28900000000 },
        { stage: 'Series B', deals: 890, amount: 32100000000 },
        { stage: 'Seed', deals: 1560, amount: 12300000000 },
        { stage: 'Series C', deals: 340, amount: 18700000000 }
      ],
      topSectors: [
        { sector: 'Fintech', deals: 456, amount: 22300000000 },
        { sector: 'Healthcare', deals: 389, amount: 18900000000 },
        { sector: 'AI/ML', deals: 312, amount: 15600000000 },
        { sector: 'E-commerce', deals: 278, amount: 12800000000 }
      ],
      monthlyTrend: [
        { month: 'Jan', deals: 340, amount: 8900000000 },
        { month: 'Feb', deals: 325, amount: 8200000000 },
        { month: 'Mar', deals: 410, amount: 10500000000 },
        { month: 'Apr', deals: 380, amount: 9800000000 },
        { month: 'May', deals: 395, amount: 10200000000 },
        { month: 'Jun', deals: 360, amount: 9400000000 }
      ]
    };
    
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching funding statistics:', error);
    res.status(500).json({ error: 'Failed to fetch funding statistics' });
  }
});

export { router as startupRoutes };