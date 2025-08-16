import axios from 'axios';
import { logger } from '../../utils/logger';

export interface StartupCompany {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  website: string;
  foundedDate: string;
  employeeCount: string;
  operatingStatus: string;
  lastFundingType: string;
  totalFundingAmount: number;
  numFundingRounds: number;
  industries: string[];
  headquarters: {
    city: string;
    region: string;
    country: string;
  };
  founders: Array<{
    name: string;
    title: string;
  }>;
  investors: Array<{
    name: string;
    type: string;
    leadInvestor: boolean;
  }>;
  fundingRounds: Array<{
    id: string;
    type: string;
    announcedDate: string;
    raisedAmount: number;
    currency: string;
    seriesName: string;
    investorCount: number;
    leadInvestors: string[];
  }>;
  competitors: Array<{
    name: string;
    similarity: number;
  }>;
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
}

export interface InvestmentTrend {
  period: string;
  totalDeals: number;
  totalAmount: number;
  averageDealSize: number;
  topSectors: Array<{
    sector: string;
    dealCount: number;
    totalAmount: number;
  }>;
  topInvestors: Array<{
    name: string;
    dealCount: number;
    totalAmount: number;
  }>;
  stageTrends: Array<{
    stage: string;
    dealCount: number;
    totalAmount: number;
    averageSize: number;
  }>;
}

export interface InvestorProfile {
  id: string;
  name: string;
  type: string; // vc, angel, pe, corporate, etc.
  description: string;
  website: string;
  foundedDate: string;
  headquarters: {
    city: string;
    region: string;
    country: string;
  };
  investmentStages: string[];
  investmentTypes: string[];
  sectors: string[];
  portfolioCompanies: Array<{
    name: string;
    investmentDate: string;
    fundingRound: string;
    amount: number;
    status: string;
  }>;
  totalInvestments: number;
  activeInvestments: number;
  exits: number;
  totalAUM: number;
  averageInvestmentSize: number;
  contactInfo: {
    email: string;
    phone: string;
    socialMedia: {
      linkedin: string;
      twitter: string;
    };
  };
}

class CrunchbaseService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.crunchbase.com/api/v4';

  constructor() {
    this.apiKey = process.env.CRUNCHBASE_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('Crunchbase API key not configured');
    }
  }

  private async makeRequest(endpoint: string, params: any = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: {
          ...params,
          user_key: this.apiKey,
        },
        headers: {
          'X-cb-user-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      logger.error(`Crunchbase API error for ${endpoint}:`, error);
      throw error;
    }
  }

  async searchCompanies(query: string, limit: number = 20): Promise<StartupCompany[]> {
    try {
      const data = await this.makeRequest('/searches/organizations', {
        query,
        limit,
        field_ids: [
          'identifier',
          'name',
          'short_description',
          'description',
          'website',
          'founded_on',
          'employee_count',
          'operating_status',
          'last_funding_type',
          'funding_total',
          'num_funding_rounds',
          'categories',
          'location_identifiers',
          'founder_identifiers',
          'investor_identifiers',
        ].join(','),
      });

      return data.entities?.map(this.transformCompanyData) || [];
    } catch (error) {
      logger.error('Error searching companies:', error);
      return [];
    }
  }

  async getCompanyDetails(identifier: string): Promise<StartupCompany | null> {
    try {
      const data = await this.makeRequest(`/entities/organizations/${identifier}`, {
        field_ids: [
          'identifier',
          'name',
          'short_description',
          'description',
          'website',
          'founded_on',
          'employee_count',
          'operating_status',
          'last_funding_type',
          'funding_total',
          'num_funding_rounds',
          'categories',
          'location_identifiers',
          'founder_identifiers',
          'investor_identifiers',
          'funding_rounds',
          'competitors',
          'social_media',
        ].join(','),
      });

      return this.transformCompanyData(data.properties);
    } catch (error) {
      logger.error('Error fetching company details:', error);
      return null;
    }
  }

  async getFundingRounds(companyId: string) {
    try {
      const data = await this.makeRequest(`/entities/organizations/${companyId}/funding_rounds`, {
        field_ids: [
          'identifier',
          'investment_type',
          'announced_on',
          'money_raised',
          'target_money_raised',
          'currency',
          'series',
          'num_investors',
          'lead_investors',
          'investors',
        ].join(','),
      });

      return data.entities?.map((round: any) => ({
        id: round.identifier?.value,
        type: round.investment_type?.value,
        announcedDate: round.announced_on?.value,
        raisedAmount: round.money_raised?.value || 0,
        targetAmount: round.target_money_raised?.value || 0,
        currency: round.currency?.value,
        seriesName: round.series?.value,
        investorCount: round.num_investors?.value || 0,
        leadInvestors: round.lead_investors?.map((inv: any) => inv.name) || [],
        investors: round.investors?.map((inv: any) => inv.name) || [],
      })) || [];
    } catch (error) {
      logger.error('Error fetching funding rounds:', error);
      return [];
    }
  }

  async getInvestmentTrends(period: 'monthly' | 'quarterly' | 'yearly' = 'quarterly'): Promise<InvestmentTrend[]> {
    try {
      // This would typically involve complex aggregation queries
      // For now, returning mock data structure that would come from analytics
      const data = await this.makeRequest('/searches/funding_rounds', {
        limit: 1000,
        field_ids: [
          'announced_on',
          'money_raised',
          'investment_type',
          'organization_identifier',
          'investor_identifiers',
        ].join(','),
      });

      // Process and aggregate the data
      return this.aggregateInvestmentTrends(data.entities || [], period);
    } catch (error) {
      logger.error('Error fetching investment trends:', error);
      return [];
    }
  }

  async searchInvestors(query: string, type?: string): Promise<InvestorProfile[]> {
    try {
      const params: any = {
        query,
        entity_types: 'investor',
        limit: 20,
        field_ids: [
          'identifier',
          'name',
          'investor_type',
          'description',
          'website',
          'founded_on',
          'location_identifiers',
          'investment_stage',
          'investment_type',
          'categories',
          'num_portfolio_organizations',
          'num_investments',
          'num_exits',
        ].join(','),
      };

      if (type) {
        params.investor_types = type;
      }

      const data = await this.makeRequest('/searches/principals', params);
      return data.entities?.map(this.transformInvestorData) || [];
    } catch (error) {
      logger.error('Error searching investors:', error);
      return [];
    }
  }

  async getInvestorPortfolio(investorId: string) {
    try {
      const data = await this.makeRequest(`/entities/organizations/${investorId}/investments`, {
        field_ids: [
          'organization_identifier',
          'funding_round_identifier',
          'announced_on',
          'money_invested',
          'is_lead_investor',
        ].join(','),
      });

      return data.entities?.map((investment: any) => ({
        companyName: investment.organization_identifier?.value,
        fundingRound: investment.funding_round_identifier?.value,
        announcedDate: investment.announced_on?.value,
        amountInvested: investment.money_invested?.value || 0,
        isLeadInvestor: investment.is_lead_investor?.value || false,
      })) || [];
    } catch (error) {
      logger.error('Error fetching investor portfolio:', error);
      return [];
    }
  }

  private transformCompanyData(data: any): StartupCompany {
    return {
      id: data.identifier?.value || '',
      name: data.name || '',
      shortDescription: data.short_description || '',
      fullDescription: data.description || '',
      website: data.website?.value || '',
      foundedDate: data.founded_on?.value || '',
      employeeCount: data.employee_count || '',
      operatingStatus: data.operating_status || '',
      lastFundingType: data.last_funding_type || '',
      totalFundingAmount: data.funding_total?.value || 0,
      numFundingRounds: data.num_funding_rounds || 0,
      industries: data.categories?.map((cat: any) => cat.value) || [],
      headquarters: {
        city: data.location_identifiers?.[0]?.city || '',
        region: data.location_identifiers?.[0]?.region || '',
        country: data.location_identifiers?.[0]?.country || '',
      },
      founders: data.founder_identifiers?.map((founder: any) => ({
        name: founder.name || '',
        title: founder.title || 'Founder',
      })) || [],
      investors: data.investor_identifiers?.map((investor: any) => ({
        name: investor.name || '',
        type: investor.type || '',
        leadInvestor: investor.lead_investor || false,
      })) || [],
      fundingRounds: [],
      competitors: [],
      socialMedia: {
        linkedin: data.social_media?.linkedin || '',
        twitter: data.social_media?.twitter || '',
        facebook: data.social_media?.facebook || '',
      },
    };
  }

  private transformInvestorData(data: any): InvestorProfile {
    return {
      id: data.identifier?.value || '',
      name: data.name || '',
      type: data.investor_type || '',
      description: data.description || '',
      website: data.website?.value || '',
      foundedDate: data.founded_on?.value || '',
      headquarters: {
        city: data.location_identifiers?.[0]?.city || '',
        region: data.location_identifiers?.[0]?.region || '',
        country: data.location_identifiers?.[0]?.country || '',
      },
      investmentStages: data.investment_stage || [],
      investmentTypes: data.investment_type || [],
      sectors: data.categories?.map((cat: any) => cat.value) || [],
      portfolioCompanies: [],
      totalInvestments: data.num_investments || 0,
      activeInvestments: data.num_portfolio_organizations || 0,
      exits: data.num_exits || 0,
      totalAUM: 0,
      averageInvestmentSize: 0,
      contactInfo: {
        email: '',
        phone: '',
        socialMedia: {
          linkedin: '',
          twitter: '',
        },
      },
    };
  }

  private aggregateInvestmentTrends(data: any[], period: string): InvestmentTrend[] {
    // Implementation would aggregate funding round data by time periods
    // This is a simplified example
    const trends: InvestmentTrend[] = [];
    
    // Group by time period and calculate aggregates
    const grouped = data.reduce((acc, round) => {
      const date = new Date(round.announced_on?.value);
      const key = this.getPeriodKey(date, period);
      
      if (!acc[key]) {
        acc[key] = {
          period: key,
          deals: [],
          totalAmount: 0,
          sectors: new Map(),
          investors: new Map(),
          stages: new Map(),
        };
      }
      
      acc[key].deals.push(round);
      acc[key].totalAmount += round.money_raised?.value || 0;
      
      return acc;
    }, {});

    return Object.values(grouped).map((group: any) => ({
      period: group.period,
      totalDeals: group.deals.length,
      totalAmount: group.totalAmount,
      averageDealSize: group.totalAmount / group.deals.length,
      topSectors: [],
      topInvestors: [],
      stageTrends: [],
    }));
  }

  private getPeriodKey(date: Date, period: string): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;

    switch (period) {
      case 'monthly':
        return `${year}-${String(month + 1).padStart(2, '0')}`;
      case 'quarterly':
        return `${year}-Q${quarter}`;
      case 'yearly':
        return `${year}`;
      default:
        return `${year}-Q${quarter}`;
    }
  }
}

export const crunchbaseService = new CrunchbaseService();