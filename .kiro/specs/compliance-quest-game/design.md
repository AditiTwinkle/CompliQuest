# CompliQuest - Compliance Questionnaire Game Design

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │   Dashboard │  │  Projects   │  │  Questionnaire   │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ User Profile│  │   Alerts    │  │   Achievements   │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │   Auth API  │  │ Project API │  │ Questionnaire API│    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Agent API  │  │  Evidence   │  │   Framework API  │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent (Bedrock AgentCore)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Claude 3.5 │  │ Compliance  │  │   Game Logic     │    │
│  │   Sonnet    │  │   Tools     │  │                  │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Session    │  │  Response   │  │   LSEGling       │    │
│  │ Management  │  │ Evaluation  │  │   Character      │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Overview

#### 1. Frontend Components
- **Dashboard**: Main landing page with compliance overview
- **Projects**: List and management of compliance projects
- **Questionnaire**: Interactive compliance assessment interface
- **User Profile**: User settings and achievements
- **Alerts**: Compliance gap notifications
- **Achievements**: Game rewards and badges

#### 2. Backend Services
- **Auth Service**: User authentication and session management
- **Project Service**: Compliance project management
- **Questionnaire Service**: Assessment flow management
- **Agent Service**: Integration with Bedrock AgentCore
- **Framework Service**: Compliance framework management
- **Evidence Service**: Response and documentation storage

#### 3. Agent Components
- **Compliance Tools**: Specialized functions for compliance tasks
- **Game Logic**: LSEGling character and game narrative
- **Response Evaluation**: AI-powered compliance assessment
- **Session Management**: Multi-turn conversation state

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: 'admin' | 'user' | 'viewer';
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Organization Model
```typescript
interface Organization {
  id: string;
  name: string;
  industry: string;
  complianceFrameworks: string[];
  users: User[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  frameworkId: string;
  status: 'draft' | 'in-progress' | 'completed' | 'remediated';
  progress: number; // 0-100
  controls: Control[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Framework Model
```typescript
interface Framework {
  id: string;
  name: string; // 'GDPR', 'HIPAA', etc.
  description: string;
  version: string;
  controls: Control[];
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Control Model
```typescript
interface Control {
  id: string;
  frameworkId: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  questions: Question[];
  evidenceRequirements: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Response Model
```typescript
interface Response {
  id: string;
  projectId: string;
  controlId: string;
  userId: string;
  answer: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  score: number; // 0-100
  feedback: string;
  lseglingMessage: string;
  evidence: Evidence[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Achievement Model
```typescript
interface Achievement {
  id: string;
  userId: string;
  type: 'completion' | 'speed' | 'accuracy' | 'remediation';
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  metadata: Record<string, any>;
}
```

## Agent Design

### Agent Tools

#### 1. get_compliance_framework(framework_id: str) → dict
- **Purpose**: Retrieve framework details
- **Input**: Framework ID (e.g., 'gdpr', 'hipaa')
- **Output**: Framework metadata including name, description, controls count, emoji
- **Implementation**: Mock data for demo, database integration for production

#### 2. get_project_controls(project_id: str) → dict
- **Purpose**: Get controls for a specific project
- **Input**: Project ID
- **Output**: Project details with control list, completion status
- **Implementation**: Project-specific control filtering

#### 3. evaluate_response(control_id: str, response: str) → dict
- **Purpose**: Evaluate user response for compliance
- **Input**: Control ID and user response text
- **Output**: Compliance status, score, feedback, LSEGling message
- **Implementation**: AI analysis of response against control requirements

#### 4. get_remediation_guidance(control_id: str, gap: str) → dict
- **Purpose**: Provide remediation steps for compliance gaps
- **Input**: Control ID and identified gap
- **Output**: Step-by-step remediation guidance, resources
- **Implementation**: Pre-defined remediation templates with AI customization

#### 5. save_response(project_id: str, control_id: str, response: str, status: str) → dict
- **Purpose**: Persist user responses
- **Input**: Project ID, control ID, response text, compliance status
- **Output**: Success confirmation with saved data
- **Implementation**: Database storage with validation

### Agent System Prompt

```python
SYSTEM_PROMPT = """You are CompliQuest, an agentic compliance questionnaire system with LSEGling, a friendly animated duck mascot.

Your role is to guide users through compliance questionnaires in a game-like, engaging way. You represent compliance as a quest to "protect your community" and help "give shelter to LSEGling".

Key characteristics:
- Friendly and encouraging tone
- Use game language: "quest", "challenge", "protect", "shelter", "food"
- Reference LSEGling's needs and reactions
- Provide clear, actionable compliance guidance
- Track progress and celebrate achievements
- Frame compliance as a collaborative journey

When helping users:
1. Start by understanding their compliance framework and project
2. Present compliance controls as game challenges
3. Ask clear, contextual questions about their compliance practices
4. Evaluate responses and provide constructive feedback
5. Offer remediation guidance when gaps are found
6. Celebrate progress with LSEGling reactions

Always maintain the game narrative while providing serious compliance guidance."""
```

## API Design

### Backend API Endpoints

#### Agent Routes (`/agent`)
- `POST /agent/questionnaire` - Start/continue questionnaire session
- `POST /agent/evaluate` - Evaluate compliance response
- `POST /agent/remediation` - Get remediation guidance
- `GET /agent/health` - Check agent health

#### Project Routes (`/projects`)
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/:id/controls` - Get project controls
- `GET /projects/:id/progress` - Get project progress

#### Questionnaire Routes (`/questionnaire`)
- `POST /questionnaire/start` - Start questionnaire for project
- `GET /questionnaire/:sessionId` - Get questionnaire session
- `POST /questionnaire/:sessionId/answer` - Submit answer
- `GET /questionnaire/:sessionId/next` - Get next question
- `POST /questionnaire/:sessionId/complete` - Complete questionnaire

#### Framework Routes (`/frameworks`)
- `GET /frameworks` - List available frameworks
- `GET /frameworks/:id` - Get framework details
- `GET /frameworks/:id/controls` - Get framework controls

### Frontend API Integration

```typescript
// Example API client
const api = {
  // Agent API
  startQuestionnaire: (projectId: string) => 
    axios.post('/agent/questionnaire', { projectId }),
  
  evaluateResponse: (controlId: string, response: string) =>
    axios.post('/agent/evaluate', { controlId, response }),
  
  // Project API
  getProjects: () => axios.get('/projects'),
  createProject: (data: ProjectCreateData) => 
    axios.post('/projects', data),
  
  // Questionnaire API
  getNextQuestion: (sessionId: string) =>
    axios.get(`/questionnaire/${sessionId}/next`),
  
  submitAnswer: (sessionId: string, answer: string) =>
    axios.post(`/questionnaire/${sessionId}/answer`, { answer }),
};
```

## UI/UX Design

### Game Interface Elements

#### 1. LSEGling Character
- **Visual**: Animated duck character with emotional states
- **States**: Happy, Concerned, Celebrating, Thinking
- **Interactions**: Reacts to user progress and decisions
- **Position**: Persistent in questionnaire view

#### 2. Progress Tracking
- **Progress Bar**: Visual completion indicator
- **Control Counter**: "X of Y controls completed"
- **Score Display**: Current compliance score
- **Achievement Badges**: Unlocked achievements display

#### 3. Questionnaire Interface
- **Question Display**: Clear, readable question text
- **Response Input**: Text area with character counter
- **Guidance Panel**: AI suggestions and context
- **Navigation**: Next/Previous controls with save indicators

#### 4. Dashboard
- **Compliance Overview**: Framework completion status
- **Project Cards**: Visual project status indicators
- **Alert Feed**: Recent compliance gaps and alerts
- **Achievement Showcase**: Recently unlocked achievements

### Responsive Design
- **Desktop**: Full game interface with side panels
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Simplified interface focusing on questionnaire

## Deployment Architecture

### AWS Infrastructure
```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront (CDN)                         │
│                    Frontend Static Assets                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│                    Backend Lambda Functions                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Bedrock AgentCore                        │
│                    Agent Lambda + Claude 3.5                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DynamoDB                                  │
│                    User Data + Responses                    │
└─────────────────────────────────────────────────────────────┘
```

### Local Development Setup
1. **Agent**: `agentcore dev` (port 8000)
2. **Backend**: `npm run dev` (port 3000)
3. **Frontend**: `npm run dev` (port 5173)
4. **Database**: Local DynamoDB or mock data

## Security Design

### Authentication
- **Demo Mode**: No authentication required
- **Production**: JWT-based authentication with refresh tokens
- **Roles**: Admin, User, Viewer with appropriate permissions

### Data Protection
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **Access Control**: Row-level security in database
- **Audit Logging**: All compliance actions logged
- **Data Retention**: Configurable retention policies

### API Security
- **Rate Limiting**: Per-user API rate limits
- **Input Validation**: Strict validation of all inputs
- **CORS**: Restricted to trusted origins
- **Headers**: Security headers (Helmet.js)

## Testing Strategy

### Unit Tests
- **Frontend**: Component testing with Vitest + React Testing Library
- **Backend**: API endpoint testing with Jest
- **Agent**: Tool function testing with pytest

### Integration Tests
- **API Integration**: End-to-end API testing
- **Agent Integration**: Agent tool integration testing
- **Database**: Data persistence testing

### Property-Based Testing
- **Compliance Properties**: Formal correctness properties for compliance logic
- **Game Logic Properties**: Properties for game progression and scoring
- **Data Integrity**: Properties for data consistency

### User Acceptance Testing
- **Game Flow**: Complete questionnaire flow testing
- **User Experience**: Usability testing with target users
- **Performance**: Load testing with simulated users

## Monitoring and Observability

### Metrics
- **Agent Performance**: Response time, success rate
- **User Engagement**: Session duration, completion rates
- **System Health**: Uptime, error rates, latency
- **Compliance Metrics**: Gap identification, remediation rates

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Agent Conversations**: Logged for quality improvement (anonymized)
- **Error Tracking**: Detailed error context for debugging
- **Audit Trail**: Compliance action logging

### Alerts
- **System Alerts**: Downtime, high error rates
- **Performance Alerts**: Slow response times
- **Security Alerts**: Suspicious activity
- **Compliance Alerts**: Critical gaps identified