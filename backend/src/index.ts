import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import dealRoutes from './routes/deal.routes';
import sentimentRoutes from './routes/sentiment.routes';
import crmRoutes from './routes/crm.routes';
import { marketRoutes } from './routes/market.routes';
import { startupRoutes } from './routes/startup.routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import { startCronJobs } from './services/cron.service';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/startups', startupRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// WebSocket connection
io.on('connection', (socket) => {
  logger.info('New WebSocket connection', { socketId: socket.id });
  
  socket.on('join-room', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info('User joined room', { userId, socketId: socket.id });
  });
  
  socket.on('disconnect', () => {
    logger.info('WebSocket disconnected', { socketId: socket.id });
  });
});

// Export io for use in other modules
export { io };

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  
  // Start cron jobs for automated tasks
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  await prisma.$disconnect();
});