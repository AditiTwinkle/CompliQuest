# Duck Avatar Implementation Guide

## Quick Start

The duck avatar system is ready to use with mock data and prepared for real compliance data integration.

## Current State (Mock Data)

### Dashboard.tsx
```typescript
// Mock alerts simulate non-compliant questions
const mockAlerts = [
  { title: 'Malnutrition', message: 'Missing food', severity: 'high', status: 'active' },
  { title: 'Shelter', message: 'Missing shelter', severity: 'high', status: 'active' }
];

// Determine duck states
const duckStates = determineAvatarStates(mockAlerts);
// Returns: ['hungry', 'wet']

// Render duck with multiple states
<LSEGlingAvatar states={duckStates} size="large" />
```

## Future Implementation (Real Data)

### Step 1: Define Your Compliance Questions

```typescript
interface ComplianceQuestion {
  id: string;
  title: string;
  policyType: 'food' | 'water' | 'shelter' | 'rest'; // Extensible
  compliant: boolean;
  requiresRemediation: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
}
```

### Step 2: Fetch Compliance Data

```typescript
// In your Dashboard or data service
const fetchComplianceData = async () => {
  const response = await fetch('/api/compliance/questions');
  const questions: ComplianceQuestion[] = await response.json();
  return questions;
};
```

### Step 3: Use Policy Mappings

```typescript
import { getDuckStatesFromQuestions, createAlertsFromQuestions } from './config/policyStateMappings';

// Get compliance questions
const questions = await fetchComplianceData();

// Determine duck states based on non-compliant questions
const duckStates = getDuckStatesFromQuestions(questions);
// Example: If food and shelter are non-compliant → ['hungry', 'wet']

// Create alerts for display
const alerts = createAlertsFromQuestions(questions);
```

### Step 4: Render Duck Avatar

```typescript
<LSEGlingAvatar 
  states={duckStates} 
  size="large" 
/>
```

### Step 5: Handle User Actions

```typescript
const handleResolveQuestion = async (questionId: string) => {
  // User provides evidence/answers
  await updateQuestionCompliance(questionId, { compliant: true });
  
  // Refetch compliance data
  const updatedQuestions = await fetchComplianceData();
  
  // Duck state automatically updates
  const newDuckStates = getDuckStatesFromQuestions(updatedQuestions);
  setDuckStates(newDuckStates);
};
```

## Adding New Policy Types

### 1. Update Policy Mappings

Edit `frontend/src/config/policyStateMappings.ts`:

```typescript
export const policyStateMappings: PolicyMapping[] = [
  // Existing mappings...
  {
    policyType: 'healthcare',  // New policy type
    duckState: 'tired',        // Reuse existing state or add new one
    alertTitle: 'Healthcare Access',
    alertMessage: 'Healthcare policy compliance required',
    remediationAction: 'Provide healthcare documentation',
    icon: '🏥'
  }
];
```

### 2. (Optional) Add New Duck State

If you need a completely new animation state:

1. Add to `AvatarState` type in `LSEGlingAvatar.tsx`:
```typescript
export type AvatarState = 'happy' | 'hungry' | 'thirsty' | 'tired' | 'wet' | 'sick';
```

2. Add animations in the component's `<style>` section
3. Add state-specific rendering logic

## Testing

### Test Single State
```typescript
const questions = [
  { id: 'q1', policyType: 'food', compliant: false }
];
// Expected: Duck shows hungry animation
```

### Test Multiple States
```typescript
const questions = [
  { id: 'q1', policyType: 'food', compliant: false },
  { id: 'q2', policyType: 'shelter', compliant: false }
];
// Expected: Duck shows hungry + wet animations simultaneously
```

### Test All Compliant (Happy)
```typescript
const questions = [
  { id: 'q1', policyType: 'food', compliant: true },
  { id: 'q2', policyType: 'shelter', compliant: true }
];
// Expected: Duck shows happy animation
```

## API Integration Example

### Complete Dashboard Integration

```typescript
import { useState, useEffect } from 'react';
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import { getDuckStatesFromQuestions, createAlertsFromQuestions } from '../config/policyStateMappings';

export default function Dashboard() {
  const [duckStates, setDuckStates] = useState(['happy']);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      // Fetch from your API
      const response = await fetch('/api/compliance/questions');
      const questions = await response.json();

      // Determine duck states
      const states = getDuckStatesFromQuestions(questions);
      setDuckStates(states);

      // Create alerts
      const alertData = createAlertsFromQuestions(questions);
      setAlerts(alertData);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
      setLoading(false);
    }
  };

  const handleResolveIssue = async (questionId: string) => {
    // Update question compliance
    await fetch(`/api/compliance/questions/${questionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ compliant: true })
    });

    // Refresh data
    await fetchComplianceData();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Duck Avatar */}
      <LSEGlingAvatar states={duckStates} size="large" />

      {/* Alerts */}
      {alerts.map(alert => (
        <div key={alert.id}>
          <h3>{alert.icon} {alert.title}</h3>
          <p>{alert.message}</p>
          <button onClick={() => handleResolveIssue(alert.id)}>
            Fix Now
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Real-Time Updates (Optional)

### Using WebSocket

```typescript
useEffect(() => {
  const ws = new WebSocket('ws://your-api/compliance');

  ws.onmessage = (event) => {
    const updatedQuestions = JSON.parse(event.data);
    const states = getDuckStatesFromQuestions(updatedQuestions);
    setDuckStates(states);
  };

  return () => ws.close();
}, []);
```

### Using Polling

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchComplianceData();
  }, 30000); // Poll every 30 seconds

  return () => clearInterval(interval);
}, []);
```

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── LSEGlingAvatar.tsx          # Duck component
│   ├── config/
│   │   └── policyStateMappings.ts      # Policy → State mappings
│   ├── utils/
│   │   ├── avatarStateMapper.ts        # State determination logic
│   │   └── mockAlertScenarios.ts       # Test scenarios
│   └── pages/
│       └── Dashboard.tsx                # Main integration point
├── AVATAR_STATE_LOGIC.md                # Core logic documentation
├── DUCK_STATE_WORKFLOW.md               # Workflow and data structures
├── MULTI_STATE_DUCK.md                  # Multi-state implementation
├── TEST_DUCK_STATES.md                  # Testing guide
└── IMPLEMENTATION_GUIDE.md              # This file
```

## Troubleshooting

### Duck not changing states
1. Check console for errors
2. Verify `determineAvatarStates()` is returning correct states
3. Add debug logging: `console.log('Duck states:', duckStates)`

### Animations not working
1. Check CSS classes are applied: Inspect element for `avatar-container-{state}`
2. Verify multiple state classes are present for multi-state
3. Check browser console for CSS errors

### States not updating after resolution
1. Ensure compliance data is refetched after user action
2. Verify `compliant` field is updated in backend
3. Check state calculation logic in `getDuckStatesFromQuestions()`

## Summary

1. **Current:** System uses mock alerts with keyword matching
2. **Ready:** Policy mappings configured for real data
3. **Future:** Replace mock data with API calls to compliance questions
4. **Extensible:** Easy to add new policy types and states
5. **Multi-State:** Duck shows combined animations for multiple issues
