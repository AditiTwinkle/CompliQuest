import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import NotificationRepository from '../repositories/NotificationRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';
import logger from '../utils/logger';

const router = Router();

// GET /notifications
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await NotificationRepository.findByUser(req.user!.userId);
    res.json({ notifications });
  } catch (error: any) {
    logger.error('Failed to get notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /notifications/unread
router.get('/unread', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await NotificationRepository.findUnreadByUser(req.user!.userId);
    res.json({ notifications, count: notifications.length });
  } catch (error: any) {
    logger.error('Failed to get unread notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /notifications
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, title, message } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification: Notification = {
      id: uuidv4(),
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
    };

    const created = await NotificationRepository.create(notification);
    res.status(201).json({ notification: created });
  } catch (error: any) {
    logger.error('Failed to create notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /notifications/:id/read
router.put('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationRepository.markAsRead(id);
    res.json({ notification });
  } catch (error: any) {
    logger.error('Failed to mark notification as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /notifications/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await NotificationRepository.delete(id);
    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    logger.error('Failed to delete notification:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
