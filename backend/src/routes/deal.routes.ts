import { Router } from 'express';
import { DealController } from '../controllers/deal.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const dealController = new DealController();

const createDealSchema = z.object({
  name: z.string(),
  company: z.string(),
  description: z.string().optional(),
  stage: z.string(),
  value: z.number().optional(),
  probability: z.number().min(0).max(1).optional(),
  contact: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateDealSchema = createDealSchema.partial();

const moveDealSchema = z.object({
  stage: z.string(),
});

router.use(authenticate);

router.get('/', dealController.getDeals);
router.get('/:id', dealController.getDeal);
router.post('/', validateRequest(createDealSchema), dealController.createDeal);
router.put('/:id', validateRequest(updateDealSchema), dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);
router.put('/:id/move', validateRequest(moveDealSchema), dealController.moveDeal);
router.get('/:id/activities', dealController.getDealActivities);
router.post('/:id/activities', dealController.addActivity);

export default router;