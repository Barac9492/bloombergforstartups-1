import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SentimentAnalysisService } from '../services/sentiment.service';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

export class SentimentController {
  private sentimentService: SentimentAnalysisService;

  constructor() {
    this.sentimentService = new SentimentAnalysisService();
  }

  async getDealSentiment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dealId } = req.params;

      const sentiments = await prisma.sentiment.findMany({
        where: {
          dealId,
          deal: { userId: req.userId },
        },
        orderBy: { analyzedAt: 'desc' },
      });

      res.json(sentiments);
    } catch (error) {
      next(error);
    }
  }

  async analyzeSentiment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dealId, sources } = req.body;

      const deal = await prisma.deal.findFirst({
        where: {
          id: dealId,
          userId: req.userId,
        },
      });

      if (!deal) {
        throw new AppError('Deal not found', 404);
      }

      const results = await this.sentimentService.analyzeDeal(deal, sources);

      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async getSentimentTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dealId } = req.params;
      const { period = '7d' } = req.query;

      const trends = await this.sentimentService.calculateTrends(
        dealId,
        period as string
      );

      res.json(trends);
    } catch (error) {
      next(error);
    }
  }

  async batchAnalyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deals = await prisma.deal.findMany({
        where: { userId: req.userId },
      });

      const results = await Promise.all(
        deals.map(deal => this.sentimentService.analyzeDeal(deal, ['github']))
      );

      res.json({ analyzed: results.length });
    } catch (error) {
      next(error);
    }
  }
}