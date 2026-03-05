import { Router, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { userToResponse } from '../models/User';
import logger from '../utils/logger';

const router = Router();

// GET /users/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user?.userId !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userToResponse(user) });
  } catch (error: any) {
    logger.error('Failed to get user:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user?.userId !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await UserRepository.update(id, {
      name,
      updatedAt: Date.now(),
    });

    res.json({ user: userToResponse(user) });
  } catch (error: any) {
    logger.error('Failed to update user:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
