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

    // Step 5: Transform to CompliQuest MCP format
    // Convert questions to PolicyConfig format
    const policies = questions.map((q, index) => ({
      id: (index + 1).toString(),
      title: q.category,
      question: q.text,
      answers: q.options,
      correctAnswer: q.options[q.correctAnswer],
      complianceProperty: `dora-policy-${index + 1}-compliant`,
      icon: getCategoryIcon(q.category),
      successMessage: getSuccessMessage(q.category),
      severity: mapDifficultyToSeverity(q.difficulty),
    }));


    // Generate alerts from questions (one alert per policy)
    const alerts = questions.map((question, index) => {
      const relatedGap = analysisResult.gaps
        .filter(g => g.severity === 'HIGH' || g.severity === 'CRITICAL')
        [index];
      
      return {
        id: `policy-${index + 1}`,
        title: question.category,
        message: relatedGap?.description || `Compliance gap identified for ${question.category}`,
        severity: (relatedGap?.severity.toLowerCase() || 'high') as 'critical' | 'high' | 'medium' | 'low',
        status: 'open',
      };
    });

    // Return CompliQuest MCP-compatible format
    const response = {
      success: true,
      policies,
      alerts,
      timestamp: new Date().toISOString(),
      metadata: {
        organizationId,
        organizationName: organizationId === 'org-demo-bank-001' ? 'Demo Financial Services Ltd' : 'Organization',
        frameworkId,
        frameworkName: 'Digital Operational Resilience Act (DORA)',
        compliance: {
          overallPercentage: analysisResult.compliancePercentage,
          totalGaps: analysisResult.gaps.length,
          highPriorityGaps: analysisResult.gaps.filter(g => 
            g.severity === 'HIGH' || g.severity === 'CRITICAL'
          ).length,
        },
      },
      message: `Generated ${policies.length} compliance policies from ${analysisResult.gaps.length} identified gaps (${analysisResult.compliancePercentage}% compliance).`,
    };

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

/**
 * Helper function to get category icon
 */
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Risk Management': '⚠️',
    'Governance & Oversight': '👔',
    'Incident Management': '🚨',
    'Vendor Management': '🤝',
    'Security Testing': '🔒',
    'Business Continuity': '🔄',
    'Operational Resilience': '💪',
    'ICT Risk Management': '💻',
    'DORA Fundamentals': '📚',
    'DORA Scope': '🎯',
    'Third-Party Risk': '🔗',
    'Testing Requirements': '✅',
  };
  return iconMap[category] || '📋';
}

/**
 * Helper function to get success message
 */
function getSuccessMessage(category: string): string {
  const messageMap: Record<string, string> = {
    'Risk Management': 'Your organization improved risk management!',
    'Governance & Oversight': 'Your governance framework is stronger!',
    'Incident Management': 'Your incident response is enhanced!',
    'Vendor Management': 'Your vendor risk controls are improved!',
    'Security Testing': 'Your security testing is more robust!',
    'Business Continuity': 'Your business continuity is enhanced!',
    'Operational Resilience': 'Your operational resilience is improved!',
    'ICT Risk Management': 'Your ICT risk management is stronger!',
  };
  return messageMap[category] || 'Your compliance improved!';
}

/**
 * Helper function to map difficulty to severity
 */
function mapDifficultyToSeverity(difficulty: string): 'critical' | 'high' | 'medium' | 'low' {
  const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
    'hard': 'critical',
    'medium': 'high',
    'easy': 'medium',
  };
  return severityMap[difficulty] || 'medium';
}

export default router;