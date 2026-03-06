import { Router, Request, Response } from 'express';
import { doraScraper } from '../services/doraScraper';
import { organizationalChecklistService } from '../services/organizationalChecklistService';
import { gapAnalysisService } from '../services/gapAnalysisService';
import { questionGenerationService } from '../services/questionGenerationService';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

const router = Router();

/**
 * POST /api/analyze
 * Main compliance analysis endpoint - Complete workflow from DORA scraping to CompliQuest questions
 * This is the primary endpoint for the hackathon demo
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId = 'org-demo-bank-001', frameworkId = 'dora-2022' } = req.body;

    logger.info('Starting complete compliance analysis workflow', { 
      organizationId, 
      frameworkId 
    });

    // Step 1: Scrape DORA requirements
    logger.info('Step 1: Scraping DORA requirements');
    const doraContent = await doraScraper.scrapeDORARequirements();
    const requirements = doraContent.requirements;

    if (requirements.length === 0) {
      res.status(500).json({
        success: false,
        error: 'No DORA requirements found for analysis',
      } as ApiResponse<null>);
      return;
    }

    logger.info('DORA requirements scraped successfully', { 
      requirementsCount: requirements.length 
    });

    // Step 2: Get organizational controls
    logger.info('Step 2: Fetching organizational controls');
    const organizationalControls = await organizationalChecklistService.getOrganizationalControls(organizationId);

    if (organizationalControls.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No organizational controls found for the specified organization',
      } as ApiResponse<null>);
      return;
    }

    logger.info('Organizational controls retrieved successfully', { 
      controlsCount: organizationalControls.length 
    });

    // Step 3: Perform gap analysis
    logger.info('Step 3: Performing gap analysis');
    const analysisResult = await gapAnalysisService.analyzeCompliance(
      requirements,
      organizationalControls,
      organizationId
    );

    logger.info('Gap analysis completed', {
      gapsFound: analysisResult.gaps.length,
      compliancePercentage: analysisResult.compliancePercentage
    });

    // Step 4: Generate CompliQuest questions
    logger.info('Step 4: Generating CompliQuest questions');
    const questions = await questionGenerationService.generateQuestions(
      analysisResult.gaps, 
      frameworkId
    );

    logger.info('Questions generated successfully', { 
      questionsCount: questions.length 
    });

    // Step 5: Return complete analysis results
    const response = {
      success: true,
      data: {
        // CompliQuest-compatible questions (primary output)
        questions,
        
        // Analysis metadata
        metadata: {
          organizationId,
          organizationName: organizationId === 'org-demo-bank-001' ? 'Demo Financial Services Ltd' : 'Organization',
          frameworkId,
          frameworkName: 'Digital Operational Resilience Act (DORA)',
          analysisDate: new Date().toISOString(),
          
          // Workflow summary
          workflow: {
            doraRequirementsScraped: requirements.length,
            organizationalControlsAnalyzed: organizationalControls.length,
            gapsIdentified: analysisResult.gaps.length,
            questionsGenerated: questions.length,
          },
          
          // Compliance summary
          compliance: {
            overallPercentage: analysisResult.compliancePercentage,
            fullyCompliant: analysisResult.summary.fullyCompliant,
            partiallyCompliant: analysisResult.summary.partiallyCompliant,
            nonCompliant: analysisResult.summary.nonCompliant,
            highPriorityGaps: analysisResult.gaps.filter(g => 
              g.severity === 'HIGH' || g.severity === 'CRITICAL'
            ).length,
          },
          
          // Question metadata for CompliQuest
          questionMetadata: {
            totalQuestions: questions.length,
            averageDifficulty: calculateAverageDifficulty(questions),
            categories: [...new Set(questions.map(q => q.category))],
            totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
          },
        },
        
        // Optional: Include gap analysis details for debugging/transparency
        gapAnalysis: {
          gaps: analysisResult.gaps.map(gap => ({
            id: gap.id,
            requirementId: gap.requirementId,
            severity: gap.severity,
            gapType: gap.gapType,
            description: gap.description,
            businessImpact: gap.businessImpact,
          })),
          summary: analysisResult.summary,
        },
      },
      message: `Complete compliance analysis completed successfully. Generated ${questions.length} CompliQuest questions from ${analysisResult.gaps.length} identified gaps (${analysisResult.compliancePercentage}% compliance).`,
    } as ApiResponse<any>;

    logger.info('Complete compliance analysis workflow finished successfully', {
      organizationId,
      questionsGenerated: questions.length,
      gapsAnalyzed: analysisResult.gaps.length,
      compliancePercentage: analysisResult.compliancePercentage,
      workflowDuration: 'completed',
    });

    res.json(response);

  } catch (error) {
    logger.error('Complete compliance analysis workflow failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during compliance analysis workflow',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ApiResponse<null>);
  }
});

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

export default router;