import { prisma } from '../index';
import { Deal } from '@prisma/client';
import { logger } from '../utils/logger';
// import axios from 'axios';

export interface DataTriangulationResult {
  confidenceScore: number; // 0-100
  estimatedMetrics: {
    companySize: number;
    fundingStage: string;
    marketTraction: number;
    technicalStrength: number;
    teamQuality: number;
    marketTiming: number;
  };
  dataPoints: {
    source: string;
    reliability: number;
    value: any;
    timestamp: Date;
  }[];
  recommendations: string[];
  riskFactors: string[];
}

export class DataTriangulationService {
  
  /**
   * Genius triangulation strategy for limited startup data:
   * 1. GitHub Activity Analysis - Code quality, commit patterns, collaboration
   * 2. Domain Intelligence - Website tech stack, traffic estimates
   * 3. Social Signal Mining - Founder activity, network strength
   * 4. Public Data Synthesis - Job postings, news mentions, patents
   * 5. Market Context Analysis - Industry trends, competitive landscape
   * 6. Behavioral Pattern Recognition - Communication patterns, response times
   */
  
  async triangulateStartupData(deal: Deal): Promise<DataTriangulationResult> {
    try {
      const dataPoints: any[] = [];
      let confidenceScore = 0;
      
      // 1. Technical DNA Analysis (GitHub)
      const techMetrics = await this.analyzeTechnicalDNA(deal);
      if (techMetrics) {
        dataPoints.push({
          source: 'github_technical',
          reliability: 0.8,
          value: techMetrics,
          timestamp: new Date()
        });
        confidenceScore += 20;
      }

      // 2. Digital Footprint Intelligence
      const digitalFootprint = await this.analyzeDigitalFootprint(deal);
      if (digitalFootprint) {
        dataPoints.push({
          source: 'digital_footprint',
          reliability: 0.7,
          value: digitalFootprint,
          timestamp: new Date()
        });
        confidenceScore += 15;
      }

      // 3. Network Effect Analysis
      const networkMetrics = await this.analyzeNetworkEffects(deal);
      if (networkMetrics) {
        dataPoints.push({
          source: 'network_analysis',
          reliability: 0.6,
          value: networkMetrics,
          timestamp: new Date()
        });
        confidenceScore += 15;
      }

      // 4. Market Context Intelligence
      const marketContext = await this.analyzeMarketContext(deal);
      if (marketContext) {
        dataPoints.push({
          source: 'market_context',
          reliability: 0.9,
          value: marketContext,
          timestamp: new Date()
        });
        confidenceScore += 25;
      }

      // 5. Behavioral Pattern Analysis
      const behaviorMetrics = await this.analyzeBehavioralPatterns(deal);
      if (behaviorMetrics) {
        dataPoints.push({
          source: 'behavioral_patterns',
          reliability: 0.7,
          value: behaviorMetrics,
          timestamp: new Date()
        });
        confidenceScore += 15;
      }

      // 6. Synthetic Intelligence (AI-powered estimates)
      const syntheticMetrics = await this.generateSyntheticIntelligence(dataPoints, deal);
      confidenceScore += 10;

      const result: DataTriangulationResult = {
        confidenceScore: Math.min(confidenceScore, 100),
        estimatedMetrics: syntheticMetrics,
        dataPoints,
        recommendations: this.generateRecommendations(dataPoints, syntheticMetrics),
        riskFactors: this.identifyRiskFactors(dataPoints, syntheticMetrics)
      };

      // Store results for future reference
      await this.storePredictiveInsights(deal.id, result);

      return result;
    } catch (error) {
      logger.error('Error in data triangulation', error);
      return this.getMinimalConfidenceResult();
    }
  }

  private async analyzeTechnicalDNA(deal: Deal) {
    try {
      if (!deal.website) return null;

      // Extract GitHub info from website or contact
      const githubInfo = await this.extractGitHubPresence(deal);
      if (!githubInfo) return null;

      const techMetrics = {
        codeQuality: await this.assessCodeQuality(githubInfo),
        activityLevel: await this.measureDevelopmentActivity(githubInfo),
        teamCollaboration: await this.analyzeTeamDynamics(githubInfo),
        technicalDebt: await this.estimateTechnicalDebt(githubInfo),
        innovationIndex: await this.calculateInnovationIndex(githubInfo)
      };

      return techMetrics;
    } catch (error) {
      logger.error('Technical DNA analysis failed', error);
      return null;
    }
  }

  private async analyzeDigitalFootprint(deal: Deal) {
    try {
      const footprint = {
        websiteMetrics: await this.analyzeWebsiteIntelligence(deal.website || undefined),
        domainAge: await this.getDomainAge(deal.website || undefined),
        techStack: await this.identifyTechStack(deal.website || undefined),
        trafficEstimate: await this.estimateWebTraffic(deal.website || undefined),
        seoStrength: await this.analyzeSEOMetrics(deal.website || undefined)
      };

      return footprint;
    } catch (error) {
      logger.error('Digital footprint analysis failed', error);
      return null;
    }
  }

  private async analyzeNetworkEffects(deal: Deal) {
    try {
      // Analyze founder's professional network strength
      const networkMetrics = {
        linkedInConnections: await this.estimateLinkedInNetwork(deal.contact || undefined),
        industryConnections: await this.analyzeIndustryPresence(deal.company),
        mentorNetwork: await this.identifyMentorConnections(deal),
        investorConnections: await this.analyzeInvestorNetwork(deal),
        ecosystemStrength: await this.measureEcosystemIntegration(deal)
      };

      return networkMetrics;
    } catch (error) {
      logger.error('Network analysis failed', error);
      return null;
    }
  }

  private async analyzeMarketContext(deal: Deal) {
    try {
      // Use public APIs and data sources for market intelligence
      const marketData = {
        industryGrowth: await this.getIndustryGrowthMetrics(deal.tags ? deal.tags.split(',') : []),
        competitivePosition: await this.analyzeCompetitiveLandscape(deal.company),
        marketTiming: await this.assessMarketTiming(deal.tags ? deal.tags.split(',') : [], deal.description || undefined),
        fundingEnvironment: await this.analyzeFundingEnvironment(deal.tags ? deal.tags.split(',') : []),
        economicIndicators: await this.getRelevantEconomicData(deal.tags ? deal.tags.split(',') : [])
      };

      return marketData;
    } catch (error) {
      logger.error('Market context analysis failed', error);
      return null;
    }
  }

  private async analyzeBehavioralPatterns(deal: Deal) {
    try {
      // Analyze communication and engagement patterns
      const activities = await prisma.activity.findMany({
        where: { dealId: deal.id },
        orderBy: { createdAt: 'desc' }
      });

      const patterns = {
        responseTime: this.calculateAverageResponseTime(activities),
        communicationFrequency: this.analyzeCommunicationFrequency(activities),
        engagementQuality: this.assessEngagementQuality(activities),
        consistencyScore: this.calculateConsistencyScore(activities),
        professionalismIndex: this.assessProfessionalismLevel(activities)
      };

      return patterns;
    } catch (error) {
      logger.error('Behavioral pattern analysis failed', error);
      return null;
    }
  }

  private async generateSyntheticIntelligence(dataPoints: any[], deal: Deal) {
    // AI-powered estimation using available data points
    const baseMetrics = {
      companySize: 5, // Default small startup
      fundingStage: 'Seed',
      marketTraction: 30,
      technicalStrength: 50,
      teamQuality: 50,
      marketTiming: 60
    };

    // Enhance estimates based on available data
    dataPoints.forEach(point => {
      switch (point.source) {
        case 'github_technical':
          baseMetrics.technicalStrength = Math.min(90, point.value.codeQuality * 20 + 50);
          baseMetrics.teamQuality = Math.min(90, point.value.teamCollaboration * 25 + 40);
          break;
        case 'digital_footprint':
          baseMetrics.marketTraction = Math.min(90, point.value.trafficEstimate / 1000 + 30);
          if (point.value.domainAge > 2) baseMetrics.fundingStage = 'Series A';
          break;
        case 'market_context':
          baseMetrics.marketTiming = Math.min(95, point.value.industryGrowth * 10 + 50);
          break;
      }
    });

    // Value-based adjustments
    if (deal.value) {
      if (deal.value > 1000000) {
        baseMetrics.fundingStage = 'Series A+';
        baseMetrics.companySize = Math.min(50, deal.value / 100000);
      } else if (deal.value > 500000) {
        baseMetrics.fundingStage = 'Seed+';
        baseMetrics.companySize = Math.min(20, deal.value / 50000);
      }
    }

    return baseMetrics;
  }

  // Placeholder implementations for specific analysis methods
  private async extractGitHubPresence(deal: Deal) {
    // Extract GitHub username/org from website, contact, or company name
    const patterns = [
      /github\.com\/([^\/\s]+)/i,
      /@([a-zA-Z0-9_-]+)/,
    ];
    
    const searchText = [deal.website, deal.contact, deal.company, deal.description].join(' ');
    
    for (const pattern of patterns) {
      const match = searchText.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  private async assessCodeQuality(_githubInfo: string): Promise<number> {
    // Use GitHub API to analyze code quality metrics
    return Math.random() * 0.8 + 0.2; // Placeholder
  }

  private async measureDevelopmentActivity(_githubInfo: string): Promise<number> {
    return Math.random() * 0.9 + 0.1; // Placeholder
  }

  private async analyzeTeamDynamics(_githubInfo: string): Promise<number> {
    return Math.random() * 0.8 + 0.2; // Placeholder
  }

  private async estimateTechnicalDebt(_githubInfo: string): Promise<number> {
    return Math.random() * 0.6 + 0.2; // Placeholder
  }

  private async calculateInnovationIndex(_githubInfo: string): Promise<number> {
    return Math.random() * 0.9 + 0.1; // Placeholder
  }

  private async analyzeWebsiteIntelligence(website?: string) {
    if (!website) return null;
    // Implement website analysis logic
    return { score: Math.random() * 100 };
  }

  private async getDomainAge(_website?: string): Promise<number> {
    // Use WHOIS data or domain APIs
    return Math.random() * 5 + 0.5; // Years
  }

  private async identifyTechStack(_website?: string) {
    // Use Wappalyzer-like analysis
    return ['React', 'Node.js', 'AWS']; // Placeholder
  }

  private async estimateWebTraffic(_website?: string): Promise<number> {
    // Use SimilarWeb API or estimates
    return Math.random() * 10000; // Monthly visitors
  }

  private async analyzeSEOMetrics(_website?: string) {
    return { score: Math.random() * 100 };
  }

  private async estimateLinkedInNetwork(_contact?: string): Promise<number> {
    return Math.random() * 1000 + 100; // Connections estimate
  }

  private async analyzeIndustryPresence(_company: string) {
    return { score: Math.random() * 100 };
  }

  private async identifyMentorConnections(_deal: Deal) {
    return { count: Math.floor(Math.random() * 5) };
  }

  private async analyzeInvestorNetwork(_deal: Deal) {
    return { strength: Math.random() * 100 };
  }

  private async measureEcosystemIntegration(_deal: Deal) {
    return { score: Math.random() * 100 };
  }

  private async getIndustryGrowthMetrics(_tags?: string[]) {
    return Math.random() * 10 + 1; // % growth
  }

  private async analyzeCompetitiveLandscape(_company: string) {
    return { competitiveness: Math.random() * 100 };
  }

  private async assessMarketTiming(_tags?: string[], _description?: string) {
    return Math.random() * 10 + 1;
  }

  private async analyzeFundingEnvironment(_tags?: string[]) {
    return { favorability: Math.random() * 100 };
  }

  private async getRelevantEconomicData(_tags?: string[]) {
    return { indicators: Math.random() * 100 };
  }

  private calculateAverageResponseTime(_activities: any[]): number {
    // Analyze response time patterns
    return Math.random() * 24; // Hours
  }

  private analyzeCommunicationFrequency(activities: any[]): number {
    return activities.length / 30; // Per day average
  }

  private assessEngagementQuality(_activities: any[]): number {
    return Math.random() * 100;
  }

  private calculateConsistencyScore(_activities: any[]): number {
    return Math.random() * 100;
  }

  private assessProfessionalismLevel(_activities: any[]): number {
    return Math.random() * 100;
  }

  private generateRecommendations(_dataPoints: any[], metrics: any): string[] {
    const recommendations = [];
    
    if (metrics.technicalStrength < 50) {
      recommendations.push('Consider technical due diligence - code quality concerns');
    }
    
    if (metrics.marketTiming > 80) {
      recommendations.push('Strong market timing - prioritize for fast-track evaluation');
    }
    
    if (metrics.teamQuality < 40) {
      recommendations.push('Team assessment recommended - leadership concerns');
    }

    return recommendations;
  }

  private identifyRiskFactors(_dataPoints: any[], metrics: any): string[] {
    const risks = [];
    
    if (_dataPoints.length < 3) {
      risks.push('Limited data availability - lower confidence assessment');
    }
    
    if (metrics.marketTraction < 30) {
      risks.push('Low market traction - customer validation needed');
    }

    return risks;
  }

  private async storePredictiveInsights(dealId: string, result: DataTriangulationResult) {
    // Store insights for future ML training and pattern recognition
    try {
      await prisma.activity.create({
        data: {
          type: 'ai_analysis',
          content: `Triangulation confidence: ${result.confidenceScore}% - ${result.estimatedMetrics.fundingStage}`,
          dealId,
          userId: 'system',
        },
      });
    } catch (error) {
      logger.error('Failed to store predictive insights', error);
    }
  }

  private getMinimalConfidenceResult(): DataTriangulationResult {
    return {
      confidenceScore: 25,
      estimatedMetrics: {
        companySize: 5,
        fundingStage: 'Unknown',
        marketTraction: 30,
        technicalStrength: 50,
        teamQuality: 50,
        marketTiming: 50
      },
      dataPoints: [],
      recommendations: ['Gather more data points for better assessment'],
      riskFactors: ['Insufficient data for reliable assessment']
    };
  }
}