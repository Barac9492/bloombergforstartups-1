import cron from 'node-cron';
import { prisma } from '../index';
import { SentimentAnalysisService } from './sentiment.service';
import { checkAutomationRules } from './automation.service';
import { logger } from '../utils/logger';

export function startCronJobs() {
  // Run sentiment analysis every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting automated sentiment analysis');
    await runSentimentAnalysis();
  });

  // Check automation rules every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    logger.info('Checking automation rules');
    await runAutomationChecks();
  });

  // Cleanup old sentiment data weekly
  cron.schedule('0 0 * * 0', async () => {
    logger.info('Cleaning up old sentiment data');
    await cleanupOldData();
  });

  logger.info('Cron jobs started');
}

async function runSentimentAnalysis() {
  try {
    const sentimentService = new SentimentAnalysisService();
    
    const deals = await prisma.deal.findMany({
      where: {
        OR: [
          { website: { not: null } },
          { contact: { not: null } },
        ],
      },
    });

    for (const deal of deals) {
      try {
        await sentimentService.analyzeDeal(deal, ['github']);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(`Error analyzing deal ${deal.id}`, error);
      }
    }
    
    logger.info(`Sentiment analysis completed for ${deals.length} deals`);
  } catch (error) {
    logger.error('Error in sentiment analysis cron job', error);
  }
}

async function runAutomationChecks() {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        automations: { some: { enabled: true } },
      },
    });

    for (const deal of deals) {
      try {
        await checkAutomationRules(deal.id);
      } catch (error) {
        logger.error(`Error checking automation for deal ${deal.id}`, error);
      }
    }
    
    logger.info(`Automation checks completed for ${deals.length} deals`);
  } catch (error) {
    logger.error('Error in automation cron job', error);
  }
}

async function cleanupOldData() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await prisma.sentiment.deleteMany({
      where: {
        analyzedAt: { lt: thirtyDaysAgo },
      },
    });

    logger.info(`Cleaned up ${deleted.count} old sentiment records`);
  } catch (error) {
    logger.error('Error in cleanup cron job', error);
  }
}