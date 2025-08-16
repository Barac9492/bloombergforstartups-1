import { Router } from 'express';
import { CRMController } from '../controllers/crm.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const crmController = new CRMController();

router.use(authenticate);

router.post('/import/:type', crmController.importFromCRM);
router.post('/export/:type', crmController.exportToCRM);
router.get('/sync-status', crmController.getSyncStatus);
router.post('/configure/:type', crmController.configureCRM);

export default router;