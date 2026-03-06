import { Router, Request, Response } from 'express';
import { doraScraper } from '../services/doraScraper';
import { webScrapingAgent } from '../services/webScraper';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import { ScrapingError } from '../utils/errors';

const router = Router();

/**
 * POST /api/scraping/dora
 * Scrape DORA requirements from official EU documentation
 */
router.post('/dora', async (req: Request, res: Response) => {
  try {
    logger.info('DORA scraping request received');
    
    const startTime = Date.now();
    const content = await doraScraper.scrapeDORARequirements();
    const duration = Date.now() - startTime;

    const response: ApiResponse<typeof content> = {
      success: true,
      data: content,
      message: `Successfully extracted ${content.requirements.length} DORA requirements in ${duration}ms`,
    };

    logger.info('DORA scraping completed successfully', {
      requirementsCount: content.requirements.length,
      duration,
      sourceUrl: content.sourceUrl,
    });

    res.json(response);
  } catch (error) {
    logger.error('DORA scraping failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof ScrapingError ? error.message : 'Internal server error',
      message: 'Failed to scrape DORA requirements',
    };

    const statusCode = error instanceof ScrapingError ? error.statusCode : 500;
    res.status(statusCode).json(response);
  }
});

/**
 * POST /api/scraping/custom
 * Scrape requirements from a custom URL
 */
router.post('/custom', async (req: Request, res: Response) => {
  try {
    const { url, framework } = req.body;

    if (!url || !framework) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: url and framework',
      };
      return res.status(400).json(response);
    }

    logger.info('Custom scraping request received', { url, framework });

    const startTime = Date.now();
    const content = await webScrapingAgent.scrapeRegulatory({
      targetUrl: url,
      framework,
    });
    const duration = Date.now() - startTime;

    const response: ApiResponse<typeof content> = {
      success: true,
      data: content,
      message: `Successfully extracted ${content.requirements.length} requirements in ${duration}ms`,
    };

    logger.info('Custom scraping completed successfully', {
      requirementsCount: content.requirements.length,
      duration,
      sourceUrl: content.sourceUrl,
      framework,
    });

    res.json(response);
  } catch (error) {
    logger.error('Custom scraping failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof ScrapingError ? error.message : 'Internal server error',
      message: 'Failed to scrape requirements',
    };

    const statusCode = error instanceof ScrapingError ? error.statusCode : 500;
    res.status(statusCode).json(response);
  }
});

/**
 * GET /api/scraping/validate/:id
 * Validate extracted content by ID (for future use with persistence)
 */
router.get('/validate/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // For now, return a placeholder response
    // In a full implementation, this would retrieve stored content and validate it
    const response: ApiResponse<{ validation: any }> = {
      success: true,
      data: {
        validation: {
          isValid: true,
          errors: [],
          message: 'Validation endpoint placeholder - content validation would be performed here',
        },
      },
      message: 'Content validation completed',
    };

    res.json(response);
  } catch (error) {
    logger.error('Content validation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    const response: ApiResponse<null> = {
      success: false,
      error: 'Validation failed',
    };

    res.status(500).json(response);
  }
});

export default router;