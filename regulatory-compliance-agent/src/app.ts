import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes
import healthRoutes from './routes/health';
import scrapingRoutes from './routes/scraping';
import organizationalChecklistRoutes from './routes/organizationalChecklist';
import gapAnalysisRoutes from './routes/gapAnalysis';

export const createApp = (): express.Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.nodeEnv === 'production' ? false : true, // Configure based on environment
    credentials: true,
  }));

  // Rate limiting
  app.use(rateLimiter.middleware());

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use((req, res, next) => {
    logger.info('Incoming request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    next();
  });

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/scraping', scrapingRoutes);
  app.use('/api/organizational-checklist', organizationalChecklistRoutes);
  app.use('/api/gap-analysis', gapAnalysisRoutes);

  // Catch 404 and forward to error handler
  app.use(notFoundHandler);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;