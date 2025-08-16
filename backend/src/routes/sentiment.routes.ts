import { Router } from 'express';
import { SentimentController } from '../controllers/sentiment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const sentimentController = new SentimentController();

router.use(authenticate);

router.get('/:dealId', sentimentController.getDealSentiment.bind(sentimentController));
router.post('/analyze', sentimentController.analyzeSentiment.bind(sentimentController));
router.get('/trends/:dealId', sentimentController.getSentimentTrends.bind(sentimentController));
router.post('/batch-analyze', sentimentController.batchAnalyze.bind(sentimentController));

export default router;