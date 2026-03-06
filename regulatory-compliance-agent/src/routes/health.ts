import { Router, Request, Response } from 'express';
import { BedrockConfig } from '../config/bedrock';
import { logger } from '../utils/logger';
import { HealthCheckResponse, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/health', asyncHandler(async (req: Request, res: Response<ApiResponse<HealthCheckResponse>>) => {
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    services: {
      bedrock: 'available',
      scraping: 'available',
    },
  };

  try {
    // Test Bedrock connectivity
    const bedrockClient = BedrockConfig.getRuntimeClient();
    // Simple test - just check if client is initialized
    if (!bedrockClient) {
      healthCheck.services.bedrock = 'unavailable';
      healthCheck.status = 'unhealthy';
    }
  } catch (error) {
    logger.error('Bedrock health check failed', { error: (error as Error).message });
    healthCheck.services.bedrock = 'unavailable';
    healthCheck.status = 'unhealthy';
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json({
    success: healthCheck.status === 'healthy',
    data: healthCheck,
  });
}));

router.get('/ready', asyncHandler(async (req: Request, res: Response<ApiResponse<{ ready: boolean }>>) => {
  // Readiness check - ensure all required services are available
  let ready = true;
  const checks: string[] = [];

  try {
    // Check Bedrock client initialization
    BedrockConfig.getRuntimeClient();
    checks.push('bedrock-client: ok');
  } catch (error) {
    ready = false;
    checks.push(`bedrock-client: error - ${(error as Error).message}`);
  }

  logger.info('Readiness check completed', { ready, checks });

  res.status(ready ? 200 : 503).json({
    success: ready,
    data: { ready },
    message: checks.join(', '),
  });
}));

export default router;