import { Router, Response } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const router = Router();

// Agent endpoint configuration
const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000/invocations';

// POST /agent/questionnaire
// Start or continue a compliance questionnaire with the agent
router.post('/questionnaire', async (req, res: Response) => {
  try {
    const { projectId, frameworkId, prompt, sessionId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Build context-aware prompt
    const contextualPrompt = `
Project: ${projectId}
Framework: ${frameworkId}

User: ${prompt}
    `.trim();

    // Call the agent
    const response = await axios.post(AGENT_URL, {
      prompt: contextualPrompt,
      session_id: sessionId || `session-${Date.now()}`,
    });

    res.json({
      response: response.data.response,
      sessionId: response.data.session_id,
      lseglingState: response.data.lsegling_state,
    });
  } catch (error: any) {
    logger.error('Agent questionnaire failed:', error);
    res.status(500).json({
      error: 'Failed to process questionnaire',
      message: error.message,
    });
  }
});

// POST /agent/evaluate
// Evaluate a compliance response
router.post('/evaluate', async (req, res: Response) => {
  try {
    const { controlId, response, sessionId } = req.body;

    if (!controlId || !response) {
      return res.status(400).json({ error: 'Control ID and response are required' });
    }

    const prompt = `
Evaluate this compliance response:
Control: ${controlId}
Response: ${response}

Provide assessment, score, and feedback.
    `.trim();

    const agentResponse = await axios.post(AGENT_URL, {
      prompt,
      session_id: sessionId || `session-${Date.now()}`,
    });

    res.json({
      evaluation: agentResponse.data.response,
      sessionId: agentResponse.data.session_id,
    });
  } catch (error: any) {
    logger.error('Agent evaluation failed:', error);
    res.status(500).json({
      error: 'Failed to evaluate response',
      message: error.message,
    });
  }
});

// POST /agent/remediation
// Get remediation guidance from the agent
router.post('/remediation', async (req, res: Response) => {
  try {
    const { controlId, gap, sessionId } = req.body;

    if (!controlId || !gap) {
      return res.status(400).json({ error: 'Control ID and gap are required' });
    }

    const prompt = `
Provide remediation guidance for this compliance gap:
Control: ${controlId}
Gap: ${gap}

Include step-by-step remediation steps and resources.
    `.trim();

    const agentResponse = await axios.post(AGENT_URL, {
      prompt,
      session_id: sessionId || `session-${Date.now()}`,
    });

    res.json({
      guidance: agentResponse.data.response,
      sessionId: agentResponse.data.session_id,
    });
  } catch (error: any) {
    logger.error('Agent remediation failed:', error);
    res.status(500).json({
      error: 'Failed to get remediation guidance',
      message: error.message,
    });
  }
});

// GET /agent/health
// Check agent health
router.get('/health', async (req, res: Response) => {
  try {
    const response = await axios.get(AGENT_URL.replace('/invocations', '/health'));
    res.json({ status: 'healthy', agent: response.data });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Agent is not responding',
    });
  }
});

export default router;
