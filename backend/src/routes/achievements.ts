import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import AchievementRepository from '../repositories/AchievementRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Achievement } from '../models/Achievement';
import logger from '../utils/logger';

const router = Router();

// GET /users/:userId/achievements
router.get('/users/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Users can only view their own achievements unless they're admin
    if (req.user?.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const achievements = await AchievementRepository.findByUser(userId);
    res.json({ achievements });
  } catch (error: any) {
    logger.error('Failed to get user achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /projects/:projectId/achievements
router.get('/projects/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const achievements = await AchievementRepository.findByProject(projectId);
    res.json({ achievements });
  } catch (error: any) {
    logger.error('Failed to get project achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /achievements
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, projectId, type, title, description, icon } = req.body;

    if (!userId || !projectId || !type || !title || !description || !icon) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const achievement: Achievement = {
      id: uuidv4(),
      userId,
      projectId,
      type,
      title,
      description,
      icon,
      earnedAt: Date.now(),
    };

    const created = await AchievementRepository.create(achievement);
    res.status(201).json({ achievement: created });
  } catch (error: any) {
    logger.error('Failed to create achievement:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
