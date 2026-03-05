import { Router, Response } from 'express';
import FrameworkRepository from '../repositories/FrameworkRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// GET /frameworks
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const frameworks = await FrameworkRepository.listFrameworks();
    res.json({ frameworks });
  } catch (error: any) {
    logger.error('Failed to list frameworks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /frameworks/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const framework = await FrameworkRepository.getFramework(id);

    if (!framework) {
      return res.status(404).json({ error: 'Framework not found' });
    }

    res.json({ framework });
  } catch (error: any) {
    logger.error('Failed to get framework:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /frameworks/:id/controls
router.get('/:id/controls', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const controls = await FrameworkRepository.getControlsByFramework(id);
    res.json({ controls });
  } catch (error: any) {
    logger.error('Failed to get framework controls:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
