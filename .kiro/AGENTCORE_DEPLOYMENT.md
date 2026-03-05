# CompliQuest AgentCore Deployment

## Quick Start

### Prerequisites
```bash
pip install bedrock-agentcore-starter-toolkit
aws configure
```

### Local Development
```bash
cd agent
agentcore dev
```

In another terminal:
```bash
agentcore invoke --dev '{"prompt": "Start GDPR compliance questionnaire"}'
```

### Deploy to AWS
```bash
agentcore configure --entrypoint src/main.py --non-interactive
agentcore launch
```

## Architecture

```
Frontend (React) → Backend (Express) → Agent (Bedrock AgentCore) → Claude 3.5 Sonnet
```

## Agent Tools

- `get_compliance_framework(framework_id)` - Get framework details
- `get_project_controls(project_id)` - Get project controls
- `evaluate_response(control_id, response)` - Evaluate compliance response
- `get_remediation_guidance(control_id, gap)` - Get remediation steps
- `save_response(project_id, control_id, response, status)` - Save response

## Backend Integration

Agent endpoints:
- `POST /agent/questionnaire` - Start/continue questionnaire
- `POST /agent/evaluate` - Evaluate response
- `POST /agent/remediation` - Get remediation guidance
- `GET /agent/health` - Check agent health

## Features Preserved

✅ LSEGling character throughout
✅ Game narrative ("protect your community")
✅ Progress tracking
✅ Success animations
✅ Mock data for demo
✅ No authentication required
