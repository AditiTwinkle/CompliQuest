import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import EvidenceRepository from '../repositories/EvidenceRepository';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Evidence } from '../models/Evidence';
import logger from '../utils/logger';

const router = Router();

// GET /evidence/control/:controlId
router.get('/control/:controlId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { controlId } = req.params;
    const evidence = await EvidenceRepository.findByControl(controlId);
    res.json({ evidence });
  } catch (error: any) {
    logger.error('Failed to get evidence by control:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /evidence/project/:projectId
router.get('/project/:projectId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const evidence = await EvidenceRepository.findByProject(projectId);
    res.json({ evidence });
  } catch (error: any) {
    logger.error('Failed to get evidence by project:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /evidence
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { controlId, projectId, fileName, fileSize, fileType, s3Key, description } = req.body;

    if (!controlId || !projectId || !fileName || !fileSize || !fileType || !s3Key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const evidence: Evidence = {
      id: uuidv4(),
      controlId,
      projectId,
      fileName,
      fileSize,
      fileType,
      s3Key,
      uploadedBy: req.user!.userId,
      uploadedAt: Date.now(),
      description,
    };

    const created = await EvidenceRepository.create(evidence);
    res.status(201).json({ evidence: created });
  } catch (error: any) {
    logger.error('Failed to create evidence:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /evidence/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const evidence = await EvidenceRepository.findById(id);

    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    res.json({ evidence });
  } catch (error: any) {
    logger.error('Failed to get evidence:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /evidence/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await EvidenceRepository.delete(id);
    res.json({ message: 'Evidence deleted' });
  } catch (error: any) {
    logger.error('Failed to delete evidence:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
