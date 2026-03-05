import { Router, Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const router = Router();

// Mock data for demo
const mockProjects = [
  {
    id: 'proj-1',
    organizationId: 'org-1',
    name: 'AWS Security Compliance',
    frameworkId: 'iso-27001',
    status: 'in-progress',
    complianceScore: 75,
    totalControls: 114,
    compliantControls: 85,
    nonCompliantControls: 20,
    inProgressControls: 9,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  },
  {
    id: 'proj-2',
    organizationId: 'org-1',
    name: 'Data Protection Initiative',
    frameworkId: 'gdpr',
    status: 'in-progress',
    complianceScore: 82,
    totalControls: 99,
    compliantControls: 81,
    nonCompliantControls: 12,
    inProgressControls: 6,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now(),
  },
];

// GET /projects
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({ projects: mockProjects });
  } catch (error: any) {
    logger.error('Failed to list projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /projects
router.post('/', async (req: Request, res: Response) => {
  try {
    const { organizationId, name, frameworkId } = req.body;

    if (!organizationId || !name || !frameworkId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = {
      id: uuidv4(),
      organizationId,
      name,
      frameworkId,
      status: 'draft',
      complianceScore: 0,
      totalControls: 100,
      compliantControls: 0,
      nonCompliantControls: 0,
      inProgressControls: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockProjects.push(project);
    res.status(201).json({ project });
  } catch (error: any) {
    logger.error('Failed to create project:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = mockProjects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error: any) {
    logger.error('Failed to get project:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /projects/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (name) project.name = name;
    if (status) project.status = status;
    project.updatedAt = Date.now();

    res.json({ project });
  } catch (error: any) {
    logger.error('Failed to update project:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /projects/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = mockProjects.findIndex(p => p.id === id);
    if (index >= 0) {
      mockProjects.splice(index, 1);
    }
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    logger.error('Failed to delete project:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /projects/:id/score
router.get('/:id/score', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = mockProjects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ score: project.complianceScore, project });
  } catch (error: any) {
    logger.error('Failed to get project score:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
