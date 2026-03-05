import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import OrganizationRepository from '../repositories/OrganizationRepository';
import UserRepository from '../repositories/UserRepository';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';
import { Organization } from '../models/Organization';
import logger from '../utils/logger';

const router = Router();

// GET /organizations
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const organizations = await OrganizationRepository.list();
    res.json({ organizations });
  } catch (error: any) {
    logger.error('Failed to list organizations:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /organizations
router.post('/', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, logo } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Organization name is required' });
    }

    const organization: Organization = {
      id: uuidv4(),
      name,
      description,
      logo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const created = await OrganizationRepository.create(organization);
    res.status(201).json({ organization: created });
  } catch (error: any) {
    logger.error('Failed to create organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /organizations/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationRepository.findById(id);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ organization });
  } catch (error: any) {
    logger.error('Failed to get organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /organizations/:id
router.put('/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, logo } = req.body;

    const organization = await OrganizationRepository.update(id, {
      name,
      description,
      logo,
      updatedAt: Date.now(),
    });

    res.json({ organization });
  } catch (error: any) {
    logger.error('Failed to update organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /organizations/:id
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await OrganizationRepository.delete(id);
    res.json({ message: 'Organization deleted' });
  } catch (error: any) {
    logger.error('Failed to delete organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /organizations/:id/members
router.get('/:id/members', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const members = await UserRepository.findByOrganization(id);
    res.json({ members });
  } catch (error: any) {
    logger.error('Failed to get organization members:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
