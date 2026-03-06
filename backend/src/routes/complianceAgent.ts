import { Router, Response } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const router = Router();

// Regulatory Compliance Agent endpoint
const COMPLIANCE_AGENT_URL = process.env.COMPLIANCE_AGENT_URL || 'http://localhost:8001';

// GET /compliance-agent/analyze/:organizationId
// Get DORA compliance analysis with policies and alerts
router.get('/analyze/:organizationId', async (req, res: Response) => {
  try {
    const { organizationId } = req.params;

    logger.info(`Fetching compliance analysis for organization: ${organizationId}`);

    // Call the regulatory compliance agent
    const response = await axios.post(
      `${COMPLIANCE_AGENT_URL}/analyze`,
      {
        organization_id: organizationId,
      },
      {
        timeout: 30000,
      }
    );

    const agentData = response.data;

    // Transform agent response to CompliQuest format
    const policies = agentData.data.policies.map((policy: any) => ({
      id: policy.id,
      title: policy.title,
      question: policy.question,
      answers: policy.answers,
      correctAnswer: policy.correctAnswer,
      complianceProperty: policy.complianceProperty,
      icon: policy.icon,
      successMessage: policy.successMessage,
      severity: policy.severity,
    }));

    const alerts = agentData.data.alerts.map((alert: any) => ({
      id: alert.id,
      title: alert.title,
      message: alert.message,
      severity: alert.severity,
      status: alert.status,
    }));

    res.json({
      success: true,
      policies,
      alerts,
      metadata: agentData.data.metadata,
      timestamp: agentData.data.timestamp,
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
    const response = await axios.get(`${COMPLIANCE_AGENT_URL}/health`, {
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
