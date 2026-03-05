import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organizations';
import userRoutes from './routes/users';
import frameworkRoutes from './routes/frameworks';
import projectRoutes from './routes/projects';
import alertRoutes from './routes/alerts';
import achievementRoutes from './routes/achievements';
import evidenceRoutes from './routes/evidence';
import notificationRoutes from './routes/notifications';
import questionnaireRoutes from './routes/questionnaire';
import agentRoutes from './routes/agent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/organizations', organizationRoutes);
app.use('/users', userRoutes);
app.use('/frameworks', frameworkRoutes);
app.use('/projects', projectRoutes);
app.use('/alerts', alertRoutes);
app.use('/achievements', achievementRoutes);
app.use('/evidence', evidenceRoutes);
app.use('/notifications', notificationRoutes);
app.use('/questionnaire', questionnaireRoutes);
app.use('/agent', agentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
