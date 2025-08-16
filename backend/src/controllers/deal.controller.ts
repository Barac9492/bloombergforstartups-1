import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma, io } from '../index';
import { AppError } from '../middleware/errorHandler';
import { checkAutomationRules } from '../services/automation.service';

export class DealController {
  async getDeals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deals = await prisma.deal.findMany({
        where: { userId: req.userId },
        include: {
          sentiments: {
            orderBy: { analyzedAt: 'desc' },
            take: 1,
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      res.json(deals);
    } catch (error) {
      next(error);
    }
  }

  async getDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deal = await prisma.deal.findFirst({
        where: {
          id,
          userId: req.userId,
        },
        include: {
          sentiments: {
            orderBy: { analyzedAt: 'desc' },
          },
          activities: {
            orderBy: { createdAt: 'desc' },
          },
          automations: true,
        },
      });

      if (!deal) {
        throw new AppError('Deal not found', 404);
      }

      res.json(deal);
    } catch (error) {
      next(error);
    }
  }

  async createDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deal = await prisma.deal.create({
        data: {
          ...req.body,
          userId: req.userId!,
        },
      });

      // Emit real-time update
      io.to(`user-${req.userId}`).emit('deal-created', deal);

      res.status(201).json(deal);
    } catch (error) {
      next(error);
    }
  }

  async updateDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deal = await prisma.deal.update({
        where: {
          id,
          userId: req.userId,
        },
        data: req.body,
      });

      // Check automation rules
      await checkAutomationRules(deal.id);

      // Emit real-time update
      io.to(`user-${req.userId}`).emit('deal-updated', deal);

      res.json(deal);
    } catch (error) {
      next(error);
    }
  }

  async deleteDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.deal.delete({
        where: {
          id,
          userId: req.userId,
        },
      });

      // Emit real-time update
      io.to(`user-${req.userId}`).emit('deal-deleted', id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async moveDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stage } = req.body;

      const deal = await prisma.deal.update({
        where: {
          id,
          userId: req.userId,
        },
        data: { stage },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          type: 'stage_change',
          content: `Deal moved to ${stage}`,
          dealId: id,
          userId: req.userId!,
        },
      });

      // Check automation rules
      await checkAutomationRules(deal.id);

      // Emit real-time update
      io.to(`user-${req.userId}`).emit('deal-moved', { dealId: id, stage });

      res.json(deal);
    } catch (error) {
      next(error);
    }
  }

  async getDealActivities(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const activities = await prisma.activity.findMany({
        where: {
          dealId: id,
          deal: { userId: req.userId },
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async addActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, content } = req.body;

      const activity = await prisma.activity.create({
        data: {
          type,
          content,
          dealId: id,
          userId: req.userId!,
        },
      });

      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }
}