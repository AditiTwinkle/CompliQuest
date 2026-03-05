# CompliQuest - Agentic Compliance Game

A gamified compliance questionnaire system powered by AWS Bedrock AgentCore and Claude 3.5 Sonnet.

## Quick Start

### Local Development

**Terminal 1 - Agent:**
```bash
cd agent
agentcore dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

### Test Agent Locally
```bash
agentcore invoke --dev '{"prompt": "Start GDPR compliance questionnaire"}'
```

## Deploy to AWS

```bash
cd agent
agentcore configure --entrypoint src/main.py --non-interactive
agentcore launch
```

Update backend `.env`:
```env
AGENT_URL=https://xxx.bedrock-agentcore.aws.amazon.com/invocations
```

## Architecture

- **Frontend**: React/Vite - Game UI with LSEGling character
- **Backend**: Express.js - API gateway to agent
- **Agent**: Bedrock AgentCore (Strands) - Intelligent compliance logic
- **Model**: Claude 3.5 Sonnet - Compliance understanding

## Game Flow

1. **Dashboard** - View compliance status with LSEGling alerts
2. **Projects** - Browse compliance challenges
3. **Questionnaire** - Answer compliance questions with agent guidance
4. **Success** - Get feedback and remediation guidance

## Features

✅ Agentic workflow with multi-turn conversations
✅ LSEGling character throughout
✅ Game narrative ("protect your community")
✅ Intelligent compliance guidance
✅ Progress tracking
✅ AWS Bedrock AgentCore deployment
✅ Serverless architecture

## Documentation

- `.kiro/AGENTCORE_DEPLOYMENT.md` - Deployment guide
- `agent/README.md` - Agent documentation
- `backend/src/routes/agent.ts` - Agent API endpoints

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, Axios
- **Agent**: Python, Strands, Bedrock AgentCore
- **Model**: Claude 3.5 Sonnet
- **Deployment**: AWS (Lambda, CloudFront, S3)
