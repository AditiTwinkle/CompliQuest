import { Router, Request, Response } from 'express';
import { questionGenerationService } from '../services/questionGenerationService';
import { gapAnalysisService } from '../services/gapAnalysisService';
import { organizationalChecklistService } from '../services/organizationalChecklistService';
import { doraScraper } from '../services/doraScraper';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

/**
 * Helper function to calculate average difficulty
 */
function calculateAverageDifficulty(questions: any[]): string {
  if (questions.length === 0) return 'medium';
  
  const difficultyScores: Record<string, number> = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
  };
  
  const totalScore = questions.reduce((sum, q) => sum + (difficultyScores[q.difficulty as string] || 2), 0);
  const averageScore = totalScore / questions.length;
  
  if (averageScore <= 1.3) return 'easy';
  if (averageScore <= 2.3) return 'medium';
  return 'hard';
}

const router = Router();

/**
 * POST /api/questions/generate
 * Generate CompliQuest-compatible questions from gap analysis
 */
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, frameworkId = 'dora-2022', gapAnalysisId } = req.body;

    // Validate required parameters
    if (!organizationId) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameter: organizationId',
      } as ApiResponse<null>);
      return;
    }

    logger.info('Starting question generation', { organizationId, frameworkId, gapAnalysisId });

    let gaps;

    if (gapAnalysisId) {
      // Use existing gap analysis (not implemented in MVP - would require database)
      logger.warn('Gap analysis ID provided but not implemented in MVP, performing fresh analysis');
    }

    // Perform fresh gap analysis
    logger.info('Performing gap analysis for question generation');
    
    // Get DORA requirements
    const doraContent = await doraScraper.scrapeDORARequirements();
    const requirements = doraContent.requirements;

    if (requirements.length === 0) {
      res.status(500).json({
        success: false,
        error: 'No DORA requirements found for question generation',
      } as ApiResponse<null>);
      return;
    }

    // Get organizational controls
    const organizationalControls = await organizationalChecklistService.getOrganizationalControls(organizationId);

    if (organizationalControls.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No organizational controls found for the specified organization',
      } as ApiResponse<null>);
      return;
    }

    // Perform gap analysis
    const analysisResult = await gapAnalysisService.analyzeCompliance(
      requirements,
      organizationalControls,
      organizationId
    );

    gaps = analysisResult.gaps;

    if (gaps.length === 0) {
      // Generate generic questions if no gaps found
      logger.info('No gaps found, generating generic DORA questions');
    }

    // Generate questions
    logger.info('Generating CompliQuest questions', { gapsCount: gaps.length });
    const questions = await questionGenerationService.generateQuestions(gaps, frameworkId);

    // Return results
    const response = {
      success: true,
      data: {
        questions,
        metadata: {
          organizationId,
          frameworkId,
          generatedAt: new Date().toISOString(),
          totalGapsAnalyzed: gaps.length,
          questionsGenerated: questions.length,
          compliancePercentage: analysisResult.compliancePercentage,
        },
      },
      message: `Successfully generated ${questions.length} CompliQuest-compatible questions`,
    } as ApiResponse<any>;

    logger.info('Question generation completed successfully', {
      organizationId,
      questionsGenerated: questions.length,
      gapsAnalyzed: gaps.length,
    });

    res.json(response);

  } catch (error) {
    logger.error('Question generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during question generation',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

/**
 * GET /api/questions/demo
 * Generate demo questions for the demo organization
 */
router.get('/demo', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Generating demo questions');

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

    // Generate questions
    const questions = await questionGenerationService.generateQuestions(analysisResult.gaps, frameworkId);

    // Return results with additional demo context
    const response = {
      success: true,
      data: {
        questions,
        organizationName: 'Demo Financial Services Ltd',
        frameworkName: 'Digital Operational Resilience Act (DORA)',
        metadata: {
          organizationId,
          frameworkId,
          generatedAt: new Date().toISOString(),
          totalGapsAnalyzed: analysisResult.gaps.length,
          questionsGenerated: questions.length,
          compliancePercentage: analysisResult.compliancePercentage,
          demoNote: 'These questions are generated from a demonstration gap analysis using mock organizational data.',
        },
        gapAnalysisSummary: {
          totalRequirements: requirements.length,
          gapsIdentified: analysisResult.gaps.length,
          compliancePercentage: analysisResult.compliancePercentage,
          highSeverityGaps: analysisResult.gaps.filter(g => g.severity === 'HIGH' || g.severity === 'CRITICAL').length,
        },
      },
      message: `Demo: Generated ${questions.length} questions from ${analysisResult.gaps.length} identified gaps`,
    } as ApiResponse<any>;

    logger.info('Demo question generation completed', {
      questionsGenerated: questions.length,
      gapsAnalyzed: analysisResult.gaps.length,
      compliancePercentage: analysisResult.compliancePercentage,
    });

    res.json(response);

  } catch (error) {
    logger.error('Demo question generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during demo question generation',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

/**
 * GET /api/questions/compliquest/:organizationId
 * Get CompliQuest-formatted questions for an organization (CompliQuest integration endpoint)
 */
router.get('/compliquest/:organizationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const { frameworkId = 'dora-2022', refresh = 'false' } = req.query;

    logger.info('CompliQuest integration: Getting questions', { organizationId, frameworkId, refresh });

    // For MVP, always generate fresh questions (in production, this would check cache first)
    if (refresh === 'true' || true) { // Always refresh in MVP
      
      // Get DORA requirements
      const doraContent = await doraScraper.scrapeDORARequirements();
      const requirements = doraContent.requirements;

      // Get organizational controls
      const organizationalControls = await organizationalChecklistService.getOrganizationalControls(organizationId);

      if (organizationalControls.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Organization not found or has no controls configured',
        } as ApiResponse<null>);
        return;
      }

      // Perform gap analysis
      const analysisResult = await gapAnalysisService.analyzeCompliance(
        requirements,
        organizationalControls,
        organizationId
      );

      // Generate questions
      const questions = await questionGenerationService.generateQuestions(analysisResult.gaps, frameworkId as string);

      // Return in CompliQuest format
      const response = {
        success: true,
        data: {
          questions,
          metadata: {
            organizationId,
            framework: frameworkId,
            lastUpdated: new Date().toISOString(),
            totalQuestions: questions.length,
            averageDifficulty: calculateAverageDifficulty(questions),
            complianceContext: {
              totalGaps: analysisResult.gaps.length,
              compliancePercentage: analysisResult.compliancePercentage,
              highPriorityGaps: analysisResult.gaps.filter(g => g.severity === 'HIGH' || g.severity === 'CRITICAL').length,
            },
          },
        },
        message: 'CompliQuest questions retrieved successfully',
      } as ApiResponse<any>;

      res.json(response);

    } else {
      // In production, this would return cached questions
      res.status(501).json({
        success: false,
        error: 'Cached questions not implemented in MVP',
      } as ApiResponse<null>);
    }

  } catch (error) {
    logger.error('CompliQuest integration failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      organizationId: req.params.organizationId,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during CompliQuest integration',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

export default router;