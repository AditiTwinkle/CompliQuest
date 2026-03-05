# CompliQuest Agentic Setup

## What's New

CompliQuest is now an **agentic system** powered by AWS Bedrock AgentCore:

- **Agent Layer**: Bedrock AgentCore handles intelligent compliance logic
- **Backend Gateway**: Express.js routes requests to the agent
- **Frontend**: React UI remains unchanged, calls agent endpoints
- **Deployment**: Serverless on AWS

## Files Added

```
agent/
├── src/main.py                    # Agent implementation (Strands)
├── .bedrock_agentcore.yaml        # Agent configuration
├── requirements.txt               # Python dependencies
└── README.md                      # Agent documentation

backend/src/routes/
└── agent.ts                       # Agent API endpoints

.kiro/
├── AGENTCORE_DEPLOYMENT.md        # Deployment guide
└── HACKATHON_GAME_FLOW.md         # Game flow documentation
```

## Setup Steps

### 1. Install Agent Toolkit
```bash
pip install bedrock-agentcore-starter-toolkit
aws configure
```

### 2. Start Agent Dev Server
```bash
cd agent
agentcore dev
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Test
- Visit `http://localhost:5173`
- Play the game
- Agent handles questionnaire logic

## Deploy to AWS

```bash
cd agent
agentcore configure --entrypoint src/main.py --non-interactive
agentcore launch
```

## Key Components

### Agent (Python/Strands)
- Understands compliance context
- Generates intelligent questions
- Evaluates responses
- Provides remediation guidance
- Maintains conversation state

### Backend (Express.js)
- `/agent/questionnaire` - Start/continue questionnaire
- `/agent/evaluate` - Evaluate response
- `/agent/remediation` - Get remediation guidance
- `/agent/health` - Check agent health

### Frontend (React)
- Calls agent endpoints
- Displays responses
- Shows LSEGling character
- Maintains game narrative

## Features Preserved

✅ LSEGling character
✅ Game narrative
✅ Progress tracking
✅ Success animations
✅ Mock data
✅ No authentication

## Next Steps

1. Test locally
2. Deploy agent to AWS
3. Update backend AGENT_URL
4. Deploy backend and frontend
5. Test end-to-end
