import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AirtableService } from '../services/crm/airtable.service';
import { NotionService } from '../services/crm/notion.service';
import { HubSpotService } from '../services/crm/hubspot.service';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

export class CRMController {
  private airtableService: AirtableService;
  private notionService: NotionService;
  private hubspotService: HubSpotService;

  constructor() {
    this.airtableService = new AirtableService();
    this.notionService = new NotionService();
    this.hubspotService = new HubSpotService();
  }

  async importFromCRM(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const { config } = req.body;

      let service;
      switch (type) {
        case 'airtable':
          service = this.airtableService;
          break;
        case 'notion':
          service = this.notionService;
          break;
        case 'hubspot':
          service = this.hubspotService;
          break;
        default:
          throw new AppError('Invalid CRM type', 400);
      }

      const deals = await service.importDeals(config);

      // Save imported deals
      const createdDeals = await Promise.all(
        deals.map(deal =>
          prisma.deal.create({
            data: {
              ...deal,
              userId: req.userId!,
            },
          })
        )
      );

      res.json({
        imported: createdDeals.length,
        deals: createdDeals,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportToCRM(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const { dealIds, config } = req.body;

      const deals = await prisma.deal.findMany({
        where: {
          id: { in: dealIds },
          userId: req.userId,
        },
      });

      let service;
      switch (type) {
        case 'airtable':
          service = this.airtableService;
          break;
        case 'notion':
          service = this.notionService;
          break;
        case 'hubspot':
          service = this.hubspotService;
          break;
        default:
          throw new AppError('Invalid CRM type', 400);
      }

      const results = await service.exportDeals(deals, config);

      res.json({
        exported: results.length,
        results,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSyncStatus(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const integrations = await prisma.cRMIntegration.findMany();

      res.json(integrations);
    } catch (error) {
      next(error);
    }
  }

  async configureCRM(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const { config } = req.body;

      const existing = await prisma.cRMIntegration.findFirst({
        where: { type },
      });

      const integration = existing
        ? await prisma.cRMIntegration.update({
            where: { id: existing.id },
            data: {
              config,
              status: 'active',
              updatedAt: new Date(),
            },
          })
        : await prisma.cRMIntegration.create({
            data: {
              type,
              config,
              status: 'active',
            },
          });

      res.json(integration);
    } catch (error) {
      next(error);
    }
  }
}