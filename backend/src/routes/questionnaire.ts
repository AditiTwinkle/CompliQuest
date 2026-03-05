import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ComplianceControlResponseRepository } from '../repositories/ComplianceControlResponseRepository';
import FrameworkRepository from '../repositories/FrameworkRepository';
import ProjectRepository from '../repositories/ProjectRepository';
import { ControlResponseUpdateInput } from '../models/ComplianceControlResponse';
import logger from '../utils/logger';

const router = Router();
const responseRepo = new ComplianceControlResponseRepository();

// GET /questionnaire/projects/:projectId/controls
// Get all controls for a project with their response status
router.get('/projects/:projectId/controls', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get framework controls
    const controls = await FrameworkRepository.getFrameworkControls(project.frameworkId);
    if (!controls || controls.length === 0) {
      return res.status(404).json({ error: 'No controls found for framework' });
    }

    // Get responses for this project
    const responses = await responseRepo.getByProject(projectId);
    const responseMap = new Map(responses.map(r => [r.controlId, r]));

    // Combine controls with responses
    const controlsWithResponses = controls.map(control => {
      const response = responseMap.get(control.controlId);
      return {
        ...control,
        response: response ? responseRepo.toDTO(response) : null,
      };
    });

    res.json({ controls: controlsWithResponses });
  } catch (error: any) {
    logger.error('Failed to get controls:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /questionnaire/projects/:projectId/controls/:controlId
// Get a specific control with its response
router.get(
  '/projects/:projectId/controls/:controlId',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { projectId, controlId } = req.params;

      // Verify project exists
      const project = await ProjectRepository.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Get control from framework
      const control = await FrameworkRepository.getControl(controlId);
      if (!control) {
        return res.status(404).json({ error: 'Control not found' });
      }

      // Get or create response
      let response = await responseRepo.getByProjectAndControl(projectId, controlId);
      if (!response) {
        response = await responseRepo.create({
          projectId,
          controlId,
          frameworkId: project.frameworkId,
        });
      }

      res.json({
        control,
        response: responseRepo.toDTO(response),
      });
    } catch (error: any) {
      logger.error('Failed to get control:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /questionnaire/projects/:projectId/controls/:controlId
// Submit or update a control response
router.put(
  '/projects/:projectId/controls/:controlId',
  async (req: AuthRequest, res: Response) => {
    try {
      const { projectId, controlId } = req.params;
      const { userResponse, evidenceIds, status } = req.body;

      // Verify project exists
      const project = await ProjectRepository.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Get or create response
      let response = await responseRepo.getByProjectAndControl(projectId, controlId);
      if (!response) {
        response = await responseRepo.create({
          projectId,
          controlId,
          frameworkId: project.frameworkId,
        });
      }

      // Update response
      const updateInput: ControlResponseUpdateInput = {
        userResponse,
        evidenceIds,
        status: status || 'in_progress',
      };

      const updated = await responseRepo.update(response.id, updateInput);

      // Update project compliance score
      const allResponses = await responseRepo.getByProject(projectId);
      const compliantCount = allResponses.filter(r => r.status === 'compliant').length;
      const nonCompliantCount = allResponses.filter(r => r.status === 'non_compliant').length;
      const inProgressCount = allResponses.filter(r => r.status === 'in_progress').length;

      await ProjectRepository.update(projectId, {
        compliantControls: compliantCount,
        nonCompliantControls: nonCompliantCount,
        inProgressControls: inProgressCount,
        complianceScore: Math.round((compliantCount / allResponses.length) * 100),
        updatedAt: Date.now(),
      });

      res.json({ response: responseRepo.toDTO(updated) });
    } catch (error: any) {
      logger.error('Failed to update control response:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Mock controls data
const mockControls = [
  {
    id: 'ctrl-1',
    controlId: 'ctrl-1',
    title: 'How does the AI system ensure that user consent is obtained and recorded before processing their sensitive information?',
    description: 'Consent management for sensitive data processing',
    category: 'AI Data Management & Compliance',
    severity: 'high',
    frameworkId: 'gdpr',
  },
  {
    id: 'ctrl-2',
    controlId: 'ctrl-2',
    title: 'How does the solution protect privilege infrastructure access?',
    description: 'Privilege access management and controls',
    category: 'Privilege Access Management',
    severity: 'high',
    frameworkId: 'iso-27001',
  },
];

// GET /questionnaire/projects/:projectId/next
// Get the next unanswered control
router.get('/projects/:projectId/next', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Return mock control
    const mockControl = mockControls[0];
    
    res.json({
      control: mockControl,
      response: {
        id: 'resp-1',
        projectId,
        controlId: mockControl.id,
        userResponse: '',
        status: 'not_started',
      },
    });
  } catch (error: any) {
    logger.error('Failed to get next control:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /questionnaire/projects/:projectId/progress
// Get questionnaire progress
router.get('/projects/:projectId/progress', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Return mock progress
    const progress = {
      total: 10,
      completed: 3,
      inProgress: 2,
      notStarted: 5,
      compliant: 2,
      nonCompliant: 1,
      complianceScore: 30,
    };

    res.json({ progress });
  } catch (error: any) {
    logger.error('Failed to get progress:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
