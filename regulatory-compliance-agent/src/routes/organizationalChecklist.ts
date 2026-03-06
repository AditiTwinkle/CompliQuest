import { Router, Request, Response } from 'express';
import { organizationalChecklistService } from '../services/organizationalChecklistService';
import { mockOrganizationalData } from '../services/mockOrganizationalData';
import { ApiResponse } from '../types';

const router = Router();

/**
 * GET /api/organizational-checklist/:organizationId/:frameworkId
 * Get organizational checklist for a specific organization and framework
 */
router.get('/:organizationId/:frameworkId', async (req: Request, res: Response) => {
  try {
    const { organizationId, frameworkId } = req.params;
    
    const checklist = await organizationalChecklistService.getOrganizationalChecklist(
      organizationId,
      frameworkId
    );
    
    if (!checklist) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Organizational checklist not found',
        message: `No checklist found for organization ${organizationId} and framework ${frameworkId}`,
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof checklist> = {
      success: true,
      data: checklist,
      message: 'Organizational checklist retrieved successfully',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error retrieving organizational checklist:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve organizational checklist',
    };
    return res.status(500).json(response);
  }
});

/**
 * GET /api/organizational-checklist/:organizationId/compliance-status/:frameworkId
 * Get compliance status summary for an organization and framework
 */
router.get('/:organizationId/compliance-status/:frameworkId', async (req: Request, res: Response) => {
  try {
    const { organizationId, frameworkId } = req.params;
    
    const status = await organizationalChecklistService.calculateComplianceStatus(
      organizationId,
      frameworkId
    );
    
    const response: ApiResponse<typeof status> = {
      success: true,
      data: status,
      message: 'Compliance status calculated successfully',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error calculating compliance status:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to calculate compliance status',
    };
    return res.status(500).json(response);
  }
});

/**
 * GET /api/organizational-checklist/:organizationId/summary
 * Get compliance summary for an organization
 */
router.get('/:organizationId/summary', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;
    
    const summary = await organizationalChecklistService.getComplianceSummary(organizationId);
    
    const response: ApiResponse<typeof summary> = {
      success: true,
      data: summary,
      message: 'Compliance summary retrieved successfully',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error retrieving compliance summary:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve compliance summary',
    };
    return res.status(500).json(response);
  }
});

/**
 * GET /api/organizational-checklist/demo/organizations
 * Get available demo organizations for hackathon
 */
router.get('/demo/organizations', (req: Request, res: Response) => {
  try {
    const organizations = organizationalChecklistService.getDemoOrganizations();
    
    const response: ApiResponse<typeof organizations> = {
      success: true,
      data: organizations,
      message: 'Demo organizations retrieved successfully',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error retrieving demo organizations:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve demo organizations',
    };
    return res.status(500).json(response);
  }
});

/**
 * GET /api/organizational-checklist/demo/gaps
 * Get mock identified gaps for demo purposes
 */
router.get('/demo/gaps', (req: Request, res: Response) => {
  try {
    const gaps = mockOrganizationalData.getMockIdentifiedGaps();
    
    const response: ApiResponse<typeof gaps> = {
      success: true,
      data: gaps,
      message: 'Mock compliance gaps retrieved successfully',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error retrieving mock gaps:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve mock gaps',
    };
    return res.status(500).json(response);
  }
});

/**
 * POST /api/organizational-checklist/:organizationId/validate
 * Validate an organizational checklist
 */
router.post('/:organizationId/validate', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;
    const { frameworkId } = req.body;
    
    if (!frameworkId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing framework ID',
        message: 'Framework ID is required for validation',
      };
      return res.status(400).json(response);
    }
    
    const checklist = await organizationalChecklistService.getOrganizationalChecklist(
      organizationId,
      frameworkId
    );
    
    if (!checklist) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Checklist not found',
        message: 'Cannot validate non-existent checklist',
      };
      return res.status(404).json(response);
    }
    
    const validation = organizationalChecklistService.validateChecklist(checklist);
    
    const response: ApiResponse<typeof validation> = {
      success: true,
      data: validation,
      message: 'Checklist validation completed',
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error validating checklist:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to validate checklist',
    };
    return res.status(500).json(response);
  }
});

export default router;