import Sentiment from 'sentiment';
import { prisma, io } from '../index';
import { Deal } from '@prisma/client';
import { logger } from '../utils/logger';
import { GitHubService } from './social/github.service';
import { TwitterService } from './social/twitter.service';
import { LinkedInService } from './social/linkedin.service';

export class SentimentAnalysisService {
  private sentiment: Sentiment;
  private githubService: GitHubService;
  private twitterService: TwitterService;
  private linkedinService: LinkedInService;

  constructor() {
    this.sentiment = new Sentiment();
    this.githubService = new GitHubService();
    this.twitterService = new TwitterService();
    this.linkedinService = new LinkedInService();
  }

  async analyzeDeal(deal: Deal, sources: string[] = ['github']) {
    const results = [];

    for (const source of sources) {
      try {
        const content = await this.fetchContent(deal, source);
        if (content && content.length > 0) {
          const analysis = await this.analyzeContent(content, source, deal.id);
          results.push(...analysis);
        }
      } catch (error) {
        logger.error(`Error analyzing ${source} for deal ${deal.id}`, error);
      }
    }

    // Check for sentiment alerts
    await this.checkSentimentAlerts(deal.id);

    return results;
  }

  private async fetchContent(deal: Deal, source: string): Promise<any[]> {
    switch (source) {
      case 'github':
        return this.githubService.fetchActivity(deal.website || deal.company);
      case 'twitter':
        return this.twitterService.fetchTweets(deal.contact || deal.company);
      case 'linkedin':
        return this.linkedinService.fetchPosts(deal.contact || deal.company);
      default:
        return [];
    }
  }

  private async analyzeContent(
    content: any[],
    source: string,
    dealId: string
  ) {
    const results = [];

    for (const item of content) {
      const text = this.extractText(item, source);
      const analysis = this.sentiment.analyze(text);
      
      const category = this.categorizeScore(analysis.score);
      
      const sentimentRecord = await prisma.sentiment.create({
        data: {
          dealId,
          source,
          content: text.substring(0, 1000),
          url: item.url || null,
          score: this.normalizeScore(analysis.score),
          magnitude: Math.abs(analysis.score),
          category,
        },
      });

      results.push(sentimentRecord);
    }

    return results;
  }

  private extractText(item: any, source: string): string {
    switch (source) {
      case 'github':
        return item.message || item.description || '';
      case 'twitter':
        return item.text || '';
      case 'linkedin':
        return item.content || '';
      default:
        return '';
    }
  }

  private normalizeScore(score: number): number {
    // Normalize sentiment score to -1 to 1 range
    return Math.max(-1, Math.min(1, score / 5));
  }

  private categorizeScore(score: number): string {
    if (score > 0.3) return 'POSITIVE';
    if (score < -0.3) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  async calculateTrends(dealId: string, period: string) {
    const days = this.periodToDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sentiments = await prisma.sentiment.findMany({
      where: {
        dealId,
        analyzedAt: { gte: startDate },
      },
      orderBy: { analyzedAt: 'asc' },
    });

    // Group by day and calculate averages
    const grouped = this.groupByDay(sentiments);
    const trends = this.calculateTrendMetrics(grouped);

    return {
      period,
      dataPoints: grouped,
      trends,
      prediction: this.predictTrend(trends),
    };
  }

  private periodToDays(period: string): number {
    const map: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    return map[period] || 7;
  }

  private groupByDay(sentiments: any[]) {
    const grouped: Record<string, any> = {};

    sentiments.forEach(s => {
      const date = s.analyzedAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = {
          date,
          scores: [],
          avgScore: 0,
          count: 0,
        };
      }
      grouped[date].scores.push(s.score);
      grouped[date].count++;
    });

    // Calculate averages
    Object.values(grouped).forEach((day: any) => {
      day.avgScore = day.scores.reduce((a: number, b: number) => a + b, 0) / day.scores.length;
    });

    return Object.values(grouped);
  }

  private calculateTrendMetrics(dataPoints: any[]) {
    if (dataPoints.length < 2) return { direction: 'neutral', strength: 0 };

    const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
    const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));

    const firstAvg = this.average(firstHalf.map(d => d.avgScore));
    const secondAvg = this.average(secondHalf.map(d => d.avgScore));

    const change = secondAvg - firstAvg;
    const direction = change > 0.1 ? 'positive' : change < -0.1 ? 'negative' : 'neutral';
    const strength = Math.abs(change);

    return { direction, strength, change };
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private predictTrend(trends: any) {
    // Simple trend prediction based on recent patterns
    const { direction, strength } = trends;
    
    if (strength > 0.5) {
      return {
        prediction: direction === 'positive' ? 'improving' : 'declining',
        confidence: Math.min(strength, 0.9),
      };
    }
    
    return {
      prediction: 'stable',
      confidence: 0.5,
    };
  }

  private async checkSentimentAlerts(dealId: string) {
    const recentSentiments = await prisma.sentiment.findMany({
      where: {
        dealId,
        analyzedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (recentSentiments.length === 0) return;

    const avgScore = this.average(recentSentiments.map(s => s.score));
    
    // Alert if significant negative sentiment
    if (avgScore < -0.5) {
      const deal = await prisma.deal.findUnique({
        where: { id: dealId },
      });
      
      if (deal) {
        io.to(`user-${deal.userId}`).emit('sentiment-alert', {
          dealId,
          type: 'negative',
          message: `Significant negative sentiment detected for ${deal.name}`,
          score: avgScore,
        });
      }
    }
  }
}