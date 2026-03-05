import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import AIService from '../services/AIService';
import FrameworkRepository from '../repositories/FrameworkRepository';
import ProjectRepository from '../repositories/ProjectRepository';
import logger from '../utils/logger';

const router = Router();

// POST /ai/guidance
// Get AI guidance for a compliance control
router.post('/guidance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { controlId, frameworkId } = req.body;

    if (!controlId || !frameworkId) {
      return res.status(400).json({ error: 'controlId and frameworkId are required' });
    }

    // Get control details
    const control = await FrameworkRepository.getControl(controlId);
    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }

    // Generate guidance
    const guidance = await AIService.generateGuidance({
      controlId,
      controlTitle: control.title,
      controlDescription: control.description,
      category: control.category,
      frameworkId,
    });

    res.json({ guidance });
  } catch (error: any) {
    logger.error('Failed to generate guidance:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /ai/validate
// Validate a compliance response
router.post('/validate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { controlId, userResponse } = req.body;

    if (!controlId || !userResponse) {
      return res.status(400).json({ error: 'controlId and userResponse are required' });
    }

    // Get control details
    const control = await FrameworkRepository.getControl(controlId);
    if (!control) {
      return res.status(404).json({ error: 'Control not found' });
    }

    // Validate response
    const validation = await AIService.validateResponse(
      controlId,
      userResponse,
      control.description
    );

    res.json({ validation });
  } catch (error: any) {
    logger.error('Failed to validate response:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /ai/recommendations
// Get compliance recommendations
router.post('/recommendations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Get project details
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate recommendations
    const recommendations = await AIService.generateRecommendations(
      project.frameworkId,
      project.complianceScore
    );

    res.json({ recommendations });
  } catch (error: any) {
    logger.error('Failed to generate recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /ai/cache/clear
// Clear the guidance cache (admin only)
router.get('/cache/clear', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // In a real app, check if user is admin
    AIService.clearCache();
    res.json({ message: 'Cache cleared' });
  } catch (error: any) {
    logger.error('Failed to clear cache:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
