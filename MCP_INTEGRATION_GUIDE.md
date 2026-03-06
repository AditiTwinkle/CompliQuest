# CompliQuest MCP Integration Guide

## Overview

CompliQuest is designed to ingest dynamic compliance data from MCP (Model Context Protocol) servers. The MCP will generate policies, compliance questions, answer options, and compliance status dynamically, which will be plugged into the application's data structures.

## Architecture

```
MCP Server → API Layer → Frontend State → UI Components
```

## Data Structure

### Policy Object Schema

The MCP should provide policy data in the following format:

```typescript
interface PolicyConfig {
  id: string;                    // Unique policy identifier (e.g., "1", "2", "3")
  title: string;                 // Policy title (e.g., "Malnutrition", "Need shelter")
  question: string;              // Compliance question to ask user
  answers: string[];             // Array of possible answer options
  correctAnswer: string;         // The compliant answer (must match one in answers array)
  complianceProperty: string;    // localStorage key for tracking compliance (e.g., "hungry-compliant")
  icon: string;                  // Emoji icon for visual representation (e.g., "🍔", "🏠")
  successMessage: string;        // Message shown when user selects correct answer
  severity?: 'critical' | 'high' | 'medium' | 'low';  // Alert severity level
}
```

### Alert Object Schema

```typescript
interface Alert {
  id: string;                    // Unique alert identifier (format: "policy-{policyId}")
  title: string;                 // Alert title (matches policy title)
  message: string;               // Alert message describing the issue
  severity: 'critical' | 'high' | 'medium' | 'low';  // Alert priority
  status: string;                // Current status (e.g., "open", "resolved")
}
```

### Example MCP Response

```json
{
  "policies": [
    {
      "id": "1",
      "title": "Malnutrition",
      "question": "How does the system ensure adequate food resources are provided?",
      "answers": [
        "Regular food distribution with nutritional tracking",
        "Monthly food vouchers without monitoring",
        "No formal food provision system",
        "Other"
      ],
      "correctAnswer": "Regular food distribution with nutritional tracking",
      "complianceProperty": "hungry-compliant",
      "icon": "🍔",
      "successMessage": "Your LSEGling was given food!",
      "severity": "critical"
    },
    {
      "id": "2",
      "title": "Need shelter",
      "question": "How does the system ensure adequate shelter is provided?",
      "answers": [
        "Permanent housing with safety standards",
        "Temporary shelter without standards",
        "No formal shelter provision",
        "Other"
      ],
      "correctAnswer": "Permanent housing with safety standards",
      "complianceProperty": "wet-compliant",
      "icon": "🏠",
      "successMessage": "Your LSEGling was given shelter!",
      "severity": "high"
    }
  ],
  "alerts": [
    {
      "id": "policy-1",
      "title": "Malnutrition",
      "message": "Food resource compliance needs attention",
      "severity": "critical",
      "status": "open"
    }
  ]
}
```

## Integration Points

### 1. PolicyModal Component

**Location:** `frontend/src/components/PolicyModal.tsx`

**Current Implementation:**
```typescript
const POLICIES: Record<string, PolicyConfig> = {
  '1': { /* hardcoded policy */ },
  '2': { /* hardcoded policy */ },
  // ...
};
```

**MCP Integration:**
Replace the hardcoded `POLICIES` object with data fetched from MCP:

```typescript
// Fetch policies from MCP
const [policies, setPolicies] = useState<Record<string, PolicyConfig>>({});

useEffect(() => {
  const fetchPolicies = async () => {
    const response = await fetch('/api/mcp/policies');
    const data = await response.json();
    
    // Transform array to Record<string, PolicyConfig>
    const policiesMap = data.policies.reduce((acc, policy) => {
      acc[policy.id] = policy;
      return acc;
    }, {});
    
    setPolicies(policiesMap);
  };
  
  fetchPolicies();
}, []);
```

### 2. Dashboard Component

**Location:** `frontend/src/pages/Dashboard.tsx`

**Current Implementation:**
Uses `useNotifications()` hook to fetch alerts and projects.

**MCP Integration:**
The `NotificationContext` should be updated to fetch from MCP:

```typescript
// In NotificationContext or custom hook
const fetchAlertsFromMCP = async () => {
  const response = await fetch('/api/mcp/alerts');
  const data = await response.json();
  return data.alerts;
};
```

### 3. Avatar State Mapping

**Location:** `frontend/src/utils/avatarStateMapper.ts`

**Current Implementation:**
Maps alert IDs to avatar states based on policy numbers.

**MCP Integration:**
Ensure MCP alert IDs follow the format `policy-{policyId}` or update the mapper to handle dynamic mappings:

```typescript
export const determineAvatarStates = (alerts: Alert[]): AvatarState[] => {
  const states: AvatarState[] = [];
  
  alerts.forEach(alert => {
    // Extract policy ID from alert
    const policyId = alert.id.replace('policy-', '');
    
    // Map to avatar state based on complianceProperty
    const stateMapping = {
      'hungry-compliant': 'hungry',
      'wet-compliant': 'wet',
      'tired-compliant': 'tired',
      'thirsty-compliant': 'thirsty'
    };
    
    // Use policy metadata to determine state
    // This should come from MCP
  });
  
  return states;
};
```

## API Endpoints to Implement

### 1. Get All Policies

```
GET /api/mcp/policies
```

**Response:**
```json
{
  "policies": [PolicyConfig[]],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 2. Get Active Alerts

```
GET /api/mcp/alerts
```

**Response:**
```json
{
  "alerts": [Alert[]],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3. Submit Policy Response

```
POST /api/mcp/policies/{policyId}/respond
```

**Request Body:**
```json
{
  "answer": "Regular food distribution with nutritional tracking",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "complianceStatus": "compliant",
  "message": "Your LSEGling was given food!"
}
```

### 4. Get Compliance Status

```
GET /api/mcp/compliance/status
```

**Response:**
```json
{
  "policies": {
    "1": { "compliant": true, "lastUpdated": "2024-01-01T00:00:00Z" },
    "2": { "compliant": false, "lastUpdated": "2024-01-01T00:00:00Z" }
  }
}
```

## Implementation Steps

### Phase 1: Backend API Setup

1. Create MCP client/connector in backend
2. Implement API endpoints listed above
3. Add caching layer for policy data
4. Set up webhook/polling for real-time updates

### Phase 2: Frontend Integration

1. Create MCP service layer (`frontend/src/services/mcpService.ts`)
2. Update `NotificationContext` to use MCP service
3. Modify `PolicyModal` to use dynamic policies
4. Update localStorage keys to sync with MCP compliance properties

### Phase 3: State Management

1. Replace hardcoded policy data with MCP responses
2. Implement real-time sync for compliance status
3. Add error handling and fallback mechanisms
4. Cache MCP responses for offline support

### Phase 4: Testing

1. Mock MCP responses for development
2. Test with various policy configurations
3. Validate compliance tracking
4. Test avatar state changes with dynamic data

## MCP Service Implementation Example

```typescript
// frontend/src/services/mcpService.ts

export class MCPService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async getPolicies(): Promise<PolicyConfig[]> {
    const response = await fetch(`${this.baseUrl}/api/mcp/policies`);
    const data = await response.json();
    return data.policies;
  }
  
  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${this.baseUrl}/api/mcp/alerts`);
    const data = await response.json();
    return data.alerts;
  }
  
  async submitPolicyResponse(
    policyId: string, 
    answer: string
  ): Promise<{ isCorrect: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/mcp/policies/${policyId}/respond`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      }
    );
    return response.json();
  }
  
  async getComplianceStatus(): Promise<Record<string, boolean>> {
    const response = await fetch(`${this.baseUrl}/api/mcp/compliance/status`);
    const data = await response.json();
    
    // Transform to localStorage-compatible format
    const status: Record<string, boolean> = {};
    Object.entries(data.policies).forEach(([id, policy]: [string, any]) => {
      status[policy.complianceProperty] = policy.compliant;
    });
    
    return status;
  }
}

export const mcpService = new MCPService(process.env.REACT_APP_API_URL || '');
```

## Environment Variables

Add to `.env`:

```bash
# MCP Configuration
REACT_APP_MCP_ENABLED=true
REACT_APP_MCP_API_URL=http://localhost:3001
REACT_APP_MCP_POLLING_INTERVAL=30000  # 30 seconds
REACT_APP_MCP_CACHE_TTL=300000        # 5 minutes
```

## Migration Strategy

### Step 1: Dual Mode Support
- Keep hardcoded policies as fallback
- Add feature flag for MCP integration
- Test with MCP data in development

### Step 2: Gradual Rollout
- Enable MCP for specific users/organizations
- Monitor performance and data quality
- Collect feedback

### Step 3: Full Migration
- Remove hardcoded policy data
- Make MCP the primary data source
- Keep fallback for offline scenarios

## Error Handling

```typescript
const fetchPoliciesWithFallback = async () => {
  try {
    const policies = await mcpService.getPolicies();
    return policies;
  } catch (error) {
    console.error('Failed to fetch from MCP, using fallback:', error);
    
    // Return hardcoded policies as fallback
    return FALLBACK_POLICIES;
  }
};
```

## Real-time Updates

Consider implementing WebSocket or Server-Sent Events for real-time policy updates:

```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('ws://localhost:3001/mcp/updates');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  
  if (update.type === 'POLICY_UPDATE') {
    updatePolicies(update.policies);
  } else if (update.type === 'ALERT_UPDATE') {
    updateAlerts(update.alerts);
  }
};
```

## Testing with Mock MCP

Create a mock MCP server for development:

```typescript
// mock-mcp-server.ts
import express from 'express';

const app = express();

app.get('/api/mcp/policies', (req, res) => {
  res.json({
    policies: [
      // Dynamic policy data
    ]
  });
});

app.listen(3001, () => {
  console.log('Mock MCP server running on port 3001');
});
```

## Compliance Property Mapping

The MCP should provide a mapping between policy IDs and compliance properties:

```json
{
  "complianceMapping": {
    "1": "hungry-compliant",
    "2": "wet-compliant",
    "3": "tired-compliant",
    "4": "thirsty-compliant"
  }
}
```

This ensures the avatar state system works correctly with dynamic policies.

## Next Steps

1. Set up MCP server connection
2. Implement API endpoints
3. Create MCP service layer
4. Update components to use dynamic data
5. Test with various policy configurations
6. Deploy and monitor

## Support

For questions or issues with MCP integration, please refer to:
- MCP Documentation: [Link to MCP docs]
- CompliQuest API Docs: [Link to API docs]
- Contact: [Support email/channel]
