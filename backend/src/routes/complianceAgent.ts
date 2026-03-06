import { Router, Response } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const router = Router();

// Regulatory Compliance Agent endpoint
const COMPLIANCE_AGENT_URL = process.env.COMPLIANCE_AGENT_URL || 'http://localhost:3001';

// GET /compliance-agent/analyze/:organizationId
// Get DORA compliance analysis with policies and alerts
router.get('/analyze/:organizationId', async (req, res: Response) => {
  try {
    const { organizationId } = req.params;

    logger.info(`Fetching compliance analysis for organization: ${organizationId}`);

    // Call the regulatory compliance agent
    const response = await axios.post(
      `${COMPLIANCE_AGENT_URL}/api/analyze`,
      {
        organizationId: organizationId,
      },
      {
        timeout: 30000,
      }
    );

    const agentData = response.data;

    // The agent already returns data in CompliQuest format
    res.json({
      success: agentData.success,
      policies: agentData.policies,
      alerts: agentData.alerts,
      metadata: agentData.metadata,
      timestamp: agentData.timestamp,
    });
  } catch (error: any) {
    logger.error('Failed to fetch compliance analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance analysis',
      message: error.message,
    });
  }
});

// GET /compliance-agent/health
// Check agent health
router.get('/health', async (req, res: Response) => {
  try {
    const response = await axios.get(`${COMPLIANCE_AGENT_URL}/api/health`, {
      timeout: 5000,
    });
    res.json({
      status: 'healthy',
      agent: response.data,
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Compliance agent is not responding',
    });
  }
});

export default router;
