import { Router, Request, Response } from 'express';
import { gapAnalysisService } from '../services/gapAnalysisService';
import { organizationalChecklistService } from '../services/organizationalChecklistService';
import { doraScraper } from '../services/doraScraper';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = Router();

/**
 * POST /api/gap-analysis/analyze
 * Perform gap analysis between DORA requirements and organizational controls
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { organizationId, frameworkId } = req.body;

    // Validate required parameters
    if (!organizationId || !frameworkId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: organizationId and frameworkId',
      } as ApiResponse<null>);
    }

    logger.info('Starting gap analysis', { organizationId, frameworkId });

    // Get DORA requirements
    logger.info('Fetching DORA requirements');
    const doraContent = await doraScraper.scrapeDORARequirements();
    const requirements = doraContent.requirements;

    if (requirements.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No DORA requirements found',
      } as ApiResponse<null>);
    }

    // Get organizational controls
    logger.info('Fetching organizational controls', { organizationId });
    const organizationalControls = await organizationalChecklistService.getOrganizationalControls(organizationId);

    if (organizationalControls.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No organizational controls found for the specified organization',
      } as ApiResponse<null>);
    }

    // Perform gap analysis
    logger.info('Performing gap analysis');
    const analysisResult = await gapAnalysisService.analyzeCompliance(
      requirements,
      organizationalControls,
      organizationId
    );

    // Return results
    const response = {
      success: true,
      data: {
        organizationId,
        frameworkId,
        analysisDate: new Date().toISOString(),
        compliancePercentage: analysisResult.compliancePercentage,
        summary: analysisResult.summary,
        gaps: analysisResult.gaps,
        requirementsAnalyzed: requirements.length,
        controlsEvaluated: organizationalControls.length,
      },
      message: `Gap analysis completed successfully. ${analysisResult.gaps.length} gaps identified.`,
    } as ApiResponse<any>;

    logger.info('Gap analysis completed successfully', {
      organizationId,
      gapsFound: analysisResult.gaps.length,
      compliancePercentage: analysisResult.compliancePercentage,
    });

    res.json(response);

  } catch (error) {
    logger.error('Gap analysis failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during gap analysis',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

/**
 * GET /api/gap-analysis/demo
 * Get demo gap analysis for the demo organization
 */
router.get('/demo', async (req: Request, res: Response) => {
  try {
    logger.info('Running demo gap analysis');

    // Use demo organization
    const organizationId = 'org-demo-bank-001';
    const frameworkId = 'dora-2022';

    // Get DORA requirements
    const doraContent = await doraScraper.scrapeDORARequirements();
    const requirements = doraContent.requirements;

    // Get demo organizational controls
    const organizationalControls = await organizationalChecklistService.getOrganizationalControls(organizationId);

    // Perform gap analysis
    const analysisResult = await gapAnalysisService.analyzeCompliance(
      requirements,
      organizationalControls,
      organizationId
    );

    // Return results with additional demo context
    const response = {
      success: true,
      data: {
        organizationId,
        organizationName: 'Demo Financial Services Ltd',
        frameworkId,
        frameworkName: 'Digital Operational Resilience Act (DORA)',
        analysisDate: new Date().toISOString(),
        compliancePercentage: analysisResult.compliancePercentage,
        summary: analysisResult.summary,
        gaps: analysisResult.gaps,
        requirementsAnalyzed: requirements.length,
        controlsEvaluated: organizationalControls.length,
        demoNote: 'This is a demonstration using mock organizational data for a typical mid-size financial institution.',
      },
      message: `Demo gap analysis completed. ${analysisResult.gaps.length} gaps identified with ${analysisResult.compliancePercentage}% compliance.`,
    } as ApiResponse<any>;

    logger.info('Demo gap analysis completed', {
      gapsFound: analysisResult.gaps.length,
      compliancePercentage: analysisResult.compliancePercentage,
    });

    res.json(response);

  } catch (error) {
    logger.error('Demo gap analysis failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during demo gap analysis',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

/**
 * GET /api/gap-analysis/summary/:organizationId
 * Get gap analysis summary for an organization
 */
router.get('/summary/:organizationId', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;
    const { frameworkId = 'dora-2022' } = req.query;

    logger.info('Getting gap analysis summary', { organizationId, frameworkId });

    // Get compliance status
    const complianceStatus = await organizationalChecklistService.calculateComplianceStatus(
      organizationId,
      frameworkId as string
    );

    // Get compliance summary
    const complianceSummary = await organizationalChecklistService.getComplianceSummary(organizationId);

    const response = {
      success: true,
      data: {
        organizationId,
        frameworkId,
        complianceStatus,
        complianceSummary,
        lastUpdated: new Date().toISOString(),
      },
      message: 'Gap analysis summary retrieved successfully',
    } as ApiResponse<any>;

    res.json(response);

  } catch (error) {
    logger.error('Failed to get gap analysis summary', {
      error: error instanceof Error ? error.message : 'Unknown error',
      organizationId: req.params.organizationId,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving gap analysis summary',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

export default router;