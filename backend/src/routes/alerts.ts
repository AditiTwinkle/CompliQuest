import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import AlertRepository from '../repositories/AlertRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Alert } from '../models/Alert';
import logger from '../utils/logger';

const router = Router();

// GET /alerts
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { organizationId, status } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    let alerts: Alert[];
    if (status) {
      alerts = await AlertRepository.findByStatus(organizationId as string, status as string);
    } else {
      alerts = await AlertRepository.findByOrganization(organizationId as string);
    }

    res.json({ alerts });
  } catch (error: any) {
    logger.error('Failed to list alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /alerts
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { organizationId, userId, type, severity, title, message, relatedControlId } = req.body;

    if (!organizationId || !type || !severity || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alert: Alert = {
      id: uuidv4(),
      organizationId,
      userId,
      type,
      severity,
      title,
      message,
      relatedControlId,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const created = await AlertRepository.create(alert);
    res.status(201).json({ alert: created });
  } catch (error: any) {
    logger.error('Failed to create alert:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /alerts/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await AlertRepository.findById(id);

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ alert });
  } catch (error: any) {
    logger.error('Failed to get alert:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /alerts/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await AlertRepository.update(id, {
      status,
      updatedAt: Date.now(),
    });

    res.json({ alert });
  } catch (error: any) {
    logger.error('Failed to update alert:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /alerts/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await AlertRepository.delete(id);
    res.json({ message: 'Alert deleted' });
  } catch (error: any) {
    logger.error('Failed to delete alert:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
