# CompliQuest Agent

An agentic compliance questionnaire system powered by AWS Bedrock AgentCore and Claude 3.5 Sonnet.

## Overview

CompliQuest Agent transforms compliance questionnaires into intelligent, conversational experiences. Using the Strands framework and Bedrock AgentCore, the agent:

- Understands compliance frameworks (GDPR, HIPAA, PCI-DSS, ISO 27001)
- Generates contextual compliance questions
- Evaluates user responses against compliance standards
- Provides remediation guidance
- Maintains LSEGling character throughout the interaction
- Tracks progress across multi-turn conversations

## Architecture

```
Frontend (React)
    ↓
Backend (Express.js) → /agent/* endpoints
    ↓
Bedrock AgentCore Runtime
    ↓
CompliQuest Agent (Strands)
    ↓
Claude 3.5 Sonnet Model + Tools
```

## Quick Start

### Prerequisites

```bash
pip install bedrock-agentcore-starter-toolkit
aws configure
```

### Local Development

1. **Start the agent dev server:**
   ```bash
   agentcore dev
   ```

2. **In another terminal, test the agent:**
   ```bash
   agentcore invoke --dev '{"prompt": "Start GDPR compliance questionnaire"}'
   ```

3. **Expected response:**
   ```json
   {
     "response": "Welcome to the GDPR Compliance Challenge! I'm LSEGling...",
     "session_id": "session-xxx",
     "lsegling_state": "happy"
   }
   ```

### Deployment

1. **Configure for deployment:**
   ```bash
   agentcore configure --entrypoint src/main.py --non-interactive
   ```

2. **Deploy to AWS:**
   ```bash
   agentcore launch
   ```

3. **Test deployed agent:**
   ```bash
   agentcore invoke '{"prompt": "Start GDPR compliance questionnaire"}'
   ```

## Agent Tools

The agent has access to the following tools:

### `get_compliance_framework(framework_id: str)`
Retrieves details about a compliance framework (GDPR, HIPAA, etc.)

### `get_project_controls(project_id: str)`
Gets the compliance controls for a specific project

### `evaluate_response(control_id: str, response: str)`
Evaluates a user's compliance response and provides feedback

### `get_remediation_guidance(control_id: str, gap: str)`
Provides step-by-step remediation guidance for compliance gaps

### `save_response(project_id: str, control_id: str, response: str, status: str)`
Saves a compliance response to the system

## Integration with Backend

The backend Express.js server provides these endpoints:

- `POST /agent/questionnaire` - Start or continue a questionnaire
- `POST /agent/evaluate` - Evaluate a compliance response
- `POST /agent/remediation` - Get remediation guidance
- `GET /agent/health` - Check agent health

Example:
```bash
curl -X POST http://localhost:3000/agent/questionnaire \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj-1",
    "frameworkId": "gdpr",
    "prompt": "Start GDPR compliance questionnaire"
  }'
```

## Configuration

Edit `.bedrock_agentcore.yaml` to customize:

- Agent name and description
- Model provider and model ID
- Memory mode (NO_MEMORY, STM_ONLY, STM_AND_LTM)
- Gateway settings
- Deployment region and timeout

## Development Workflow

1. **Make changes** to `src/main.py`
2. **Dev server auto-reloads** on file save
3. **Test locally** with `agentcore invoke --dev`
4. **Verify** the response is correct
5. **Commit** changes
6. **Deploy** with `agentcore launch`

## Monitoring

### View agent status
```bash
agentcore status
```

### View agent logs
```bash
agentcore logs
```

### Stop active session
```bash
agentcore stop-session
```

## Troubleshooting

### Dev server won't start
- Check if port 8000 is in use: `lsof -i :8000`
- Try a different port: `agentcore dev --port 8001`
- Verify entrypoint in `.bedrock_agentcore.yaml`

### Agent invoke fails
- Ensure dev server is running
- Check agent logs: `agentcore logs`
- Verify AWS credentials: `aws sts get-caller-identity`

### Backend can't reach agent
- Check `AGENT_URL` environment variable
- Test connectivity: `curl http://localhost:8000/invocations`
- For deployed agent, verify AWS permissions

## Features

✅ **Intelligent Compliance Guidance** - Claude 3.5 Sonnet understands compliance context
✅ **Multi-turn Conversations** - Session management for continuous interactions
✅ **Tool Integration** - Access to compliance data and evaluation logic
✅ **LSEGling Character** - Game narrative maintained throughout
✅ **Scalable** - Bedrock AgentCore handles load automatically
✅ **Serverless** - No infrastructure management needed
✅ **Cost Efficient** - Pay per invocation

## Next Steps

1. Start local development: `agentcore dev`
2. Test agent: `agentcore invoke --dev '{"prompt": "test"}'`
3. Integrate with frontend
4. Deploy to AWS: `agentcore launch`
5. Monitor and iterate

## Resources

- [Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html)
- [Strands Framework](https://github.com/aws/bedrock-agentcore)
- [Claude 3.5 Sonnet](https://www.anthropic.com/claude)

## License

MIT
