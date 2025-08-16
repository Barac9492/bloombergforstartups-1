import { prisma, io } from '../index';
import { logger } from '../utils/logger';

export async function checkAutomationRules(dealId: string) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        automations: { where: { enabled: true } },
        sentiments: { orderBy: { analyzedAt: 'desc' }, take: 10 },
      },
    });

    if (!deal || !deal.automations.length) return;

    for (const automation of deal.automations) {
      const shouldTrigger = await evaluateTrigger(automation, deal);
      
      if (shouldTrigger) {
        await executeAction(automation, deal);
        
        // Update last run time
        await prisma.dealAutomation.update({
          where: { id: automation.id },
          data: { lastRun: new Date() },
        });
      }
    }
  } catch (error) {
    logger.error('Error checking automation rules', error);
  }
}

async function evaluateTrigger(automation: any, deal: any): Promise<boolean> {
  const { trigger, condition, lastRun } = automation;
  
  // Prevent running too frequently
  if (lastRun && Date.now() - lastRun.getTime() < 60000) {
    return false;
  }

  switch (trigger) {
    case 'sentiment_drop':
      return evaluateSentimentDrop(deal, condition);
    case 'time_in_stage':
      return evaluateTimeInStage(deal, condition);
    case 'value_threshold':
      return evaluateValueThreshold(deal, condition);
    case 'no_activity':
      return evaluateNoActivity(deal, condition);
    default:
      return false;
  }
}

function evaluateSentimentDrop(deal: any, condition: any): boolean {
  if (deal.sentiments.length < 2) return false;
  
  const recent = deal.sentiments[0].score;
  const previous = deal.sentiments[1].score;
  const threshold = condition.threshold || -0.3;
  
  return recent < threshold && recent < previous;
}

function evaluateTimeInStage(deal: any, condition: any): boolean {
  const daysInStage = Math.floor(
    (Date.now() - deal.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysInStage >= (condition.days || 7);
}

function evaluateValueThreshold(deal: any, condition: any): boolean {
  return deal.value >= (condition.minValue || 100000);
}

async function evaluateNoActivity(deal: any, condition: any): Promise<boolean> {
  const activities = await prisma.activity.findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });
  
  if (activities.length === 0) return true;
  
  const daysSinceActivity = Math.floor(
    (Date.now() - activities[0].createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceActivity >= (condition.days || 3);
}

async function executeAction(automation: any, deal: any) {
  const { action, actionData } = automation;
  
  switch (action) {
    case 'move_stage':
      await moveToStage(deal, actionData);
      break;
    case 'send_notification':
      await sendNotification(deal, actionData);
      break;
    case 'create_task':
      await createTask(deal, actionData);
      break;
    case 'update_probability':
      await updateProbability(deal, actionData);
      break;
  }
}

async function moveToStage(deal: any, actionData: any) {
  await prisma.deal.update({
    where: { id: deal.id },
    data: { stage: actionData.stage },
  });
  
  await prisma.activity.create({
    data: {
      type: 'automation',
      content: `Automatically moved to ${actionData.stage}`,
      dealId: deal.id,
      userId: deal.userId,
    },
  });
  
  io.to(`user-${deal.userId}`).emit('deal-moved', {
    dealId: deal.id,
    stage: actionData.stage,
    automated: true,
  });
}

async function sendNotification(deal: any, actionData: any) {
  io.to(`user-${deal.userId}`).emit('automation-notification', {
    dealId: deal.id,
    dealName: deal.name,
    message: actionData.message || `Automation triggered for ${deal.name}`,
    type: actionData.type || 'info',
  });
}

async function createTask(deal: any, actionData: any) {
  await prisma.activity.create({
    data: {
      type: 'task',
      content: actionData.task || `Follow up on ${deal.name}`,
      dealId: deal.id,
      userId: deal.userId,
    },
  });
}

async function updateProbability(deal: any, actionData: any) {
  const newProbability = Math.max(0, Math.min(1, actionData.probability));
  
  await prisma.deal.update({
    where: { id: deal.id },
    data: { probability: newProbability },
  });
}