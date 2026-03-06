# Regulatory Compliance Agent - Bedrock AgentCore Deployment

## Architecture

```
CompliQuest Frontend → Backend API → Bedrock AgentCore Agent → TypeScript Service
                                            ↓
                                    Claude 3.5 Sonnet
```

## Prerequisites

1. **AWS CLI configured**:
```bash
aws configure
# Enter your AWS credentials and region (us-east-1)
```

2. **Install AgentCore toolkit**:
```bash
pip install bedrock-agentcore-starter-toolkit
```

3. **Install Python dependencies**:
```bash
pip install -r requirements-agent.txt
```

## Local Development

### Step 1: Start TypeScript Service
```bash
cd regulatory-compliance-agent
npm install
npm run dev
# Service runs on http://localhost:3001
```

### Step 2: Test TypeScript Service
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"organizationId":"org-demo-bank-001"}'
```

### Step 3: Start AgentCore Agent Locally
```bash
cd regulatory-compliance-agent
agentcore dev --entrypoint src/agent_main.py
# Agent runs on http://localhost:8001
```

### Step 4: Test Agent
```bash
agentcore invoke --dev '{
  "action": "analyze",
  "organization_id": "org-demo-bank-001"
}'
```

## Deploy to AWS

### Step 1: Configure Agent
```bash
cd regulatory-compliance-agent
agentcore configure --entrypoint src/agent_main.py --non-interactive
```

### Step 2: Deploy TypeScript Service (Container)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

Build and push to ECR:
```bash
# Build Docker image
docker build -t regulatory-compliance-service .

# Tag and push to ECR
aws ecr create-repository --repository-name regulatory-compliance-service
docker tag regulatory-compliance-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/regulatory-compliance-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/regulatory-compliance-service:latest
```

### Step 3: Deploy Agent to AgentCore
```bash
agentcore launch
```

### Step 4: Get Agent Endpoint
```bash
agentcore status
# Note the agent endpoint URL
```

## Agent API

### Direct Actions

**Analyze Compliance**:
```json
{
  "action": "analyze",
  "organization_id": "org-demo-bank-001"
}
```

**Get Questions**:
```json
{
  "action": "questions",
  "organization_id": "org-demo-bank-001"
}
```

**Get Gap Analysis**:
```json
{
  "action": "gaps",
  "organization_id": "org-demo-bank-001"
}
```

**Get Organizational Status**:
```json
{
  "action": "status",
  "organization_id": "org-demo-bank-001"
}
```

### Conversational Mode

```json
{
  "prompt": "What are the critical DORA compliance gaps for our organization?",
  "organization_id": "org-demo-bank-001",
  "session_id": "user-session-123"
}
```

## Integration with CompliQuest Backend

Update backend to call AgentCore agent:

```typescript
// backend/src/services/agentService.ts
import axios from 'axios';

const AGENT_ENDPOINT = process.env.AGENTCORE_ENDPOINT || 'http://localhost:8001';

export async function getCompliancePolicies(organizationId: string) {
  const response = await axios.post(AGENT_ENDPOINT, {
    action: 'analyze',
    organization_id: organizationId
  });
  
  return response.data.result;
}
```

## Environment Variables

### TypeScript Service (.env)
```env
PORT=3001
NODE_ENV=production
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
LOG_LEVEL=info
```

### AgentCore Agent
Set in `.bedrock_agentcore.yaml`:
```yaml
environment:
  NODE_ENV: production
  LOG_LEVEL: info
  BEDROCK_MODEL_ID: anthropic.claude-3-5-sonnet-20241022-v2:0
  BEDROCK_REGION: us-east-1
```

## Monitoring

### AgentCore Logs
```bash
agentcore logs --tail 100
```

### Service Health Check
```bash
curl http://localhost:3001/api/health
```

### Agent Health Check
```bash
curl http://localhost:8001/health
```

## Troubleshooting

### Issue: Agent can't reach TypeScript service
**Solution**: Ensure service is running and accessible:
```bash
# Check service status
curl http://localhost:3001/api/health

# Check network connectivity
ping localhost
```

### Issue: Slow response times
**Solution**: Use cached knowledge base (already configured):
- Cache file: `knowledge-base/dora-requirements-cache.json`
- Response time: <1 second

### Issue: AgentCore deployment fails
**Solution**: Check AWS permissions:
```bash
aws sts get-caller-identity
aws bedrock list-foundation-models --region us-east-1
```

## Cost Optimization

- **Cache DORA requirements**: Already implemented (instant response)
- **Use Claude 3.5 Sonnet**: Optimal balance of cost and performance
- **Batch processing**: Process multiple organizations together
- **Memory optimization**: 512MB memory allocation

## Security

- **API Authentication**: Add API keys for production
- **Network Security**: Use VPC for service-to-agent communication
- **Data Encryption**: Enable encryption at rest and in transit
- **IAM Roles**: Use least-privilege IAM roles for AgentCore

## Next Steps

1. ✅ Local development and testing
2. ⏳ Deploy TypeScript service to ECS/Fargate
3. ⏳ Deploy AgentCore agent to AWS
4. ⏳ Integrate with CompliQuest backend
5. ⏳ Add authentication and monitoring
6. ⏳ Production testing and optimization

## Support

For issues or questions:
- AgentCore docs: https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html
- Strands docs: https://strands-agents.readthedocs.io/
