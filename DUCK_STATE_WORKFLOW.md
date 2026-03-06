# Duck Avatar State Workflow

## Overview
The duck avatar (Dilly) reflects the compliance status of questions/policies in the system. The duck's state changes based on whether questions are compliant or require remediation.

## Default State: Happy

**Condition:** All questions are compliant = true
- No actions or remediation needed
- All policies are satisfied
- Duck shows happy animation (bouncing, cheerful)

```typescript
compliant: true → Duck state: happy
```

## Non-Compliant States

When `compliant = false`, the duck enters one or more distress states based on the type of policy/question that needs remediation.

### State Mapping (To Be Implemented with Real Data)

Each policy type maps to a specific duck state:

| Policy Type | Duck State | Visual Indicator | User Action Required |
|-------------|-----------|------------------|---------------------|
| Food/Nutrition Policy | `hungry` | Hopping, grumbling stomach | Feed the duck (resolve malnutrition issue) |
| Water/Hydration Policy | `thirsty` | Sad, tears falling | Provide water (resolve hydration issue) |
| Shelter/Housing Policy | `wet` | Shaking, rain falling | Provide shelter (resolve housing issue) |
| Rest/Workload Policy | `tired` | Sleepy, nodding off | Reduce workload (resolve fatigue issue) |

## State Transition Logic

### Single Non-Compliant Question

```
Question: "Food Policy Compliance"
compliant: false
→ Duck state: hungry

User resolves issue
→ compliant: true
→ Duck state: happy (default)
```

### Multiple Non-Compliant Questions

```
Question 1: "Food Policy" - compliant: false → hungry
Question 2: "Shelter Policy" - compliant: false → wet
→ Duck states: [hungry, wet] (combined animations)

User resolves Food Policy
→ Question 1: compliant: true
→ Duck states: [wet] (only shelter remains)

User resolves Shelter Policy
→ Question 2: compliant: true
→ Duck state: happy (all resolved)
```

## All Possible State Combinations

### Single States
- `[happy]` - All compliant
- `[hungry]` - Food policy non-compliant
- `[thirsty]` - Water policy non-compliant
- `[wet]` - Shelter policy non-compliant
- `[tired]` - Rest policy non-compliant

### Dual States
- `[hungry, thirsty]` - Food + Water policies non-compliant
- `[hungry, wet]` - Food + Shelter policies non-compliant
- `[hungry, tired]` - Food + Rest policies non-compliant
- `[thirsty, wet]` - Water + Shelter policies non-compliant
- `[thirsty, tired]` - Water + Rest policies non-compliant
- `[wet, tired]` - Shelter + Rest policies non-compliant

### Triple States
- `[hungry, thirsty, wet]` - Food + Water + Shelter non-compliant
- `[hungry, thirsty, tired]` - Food + Water + Rest non-compliant
- `[hungry, wet, tired]` - Food + Shelter + Rest non-compliant
- `[thirsty, wet, tired]` - Water + Shelter + Rest non-compliant

### All States
- `[hungry, thirsty, wet, tired]` - All policies non-compliant (maximum distress)

## Implementation Flow

### Current Implementation (Mock Data)

```typescript
// Dashboard.tsx - Mock alerts
const mockAlerts = [
  { title: 'Malnutrition', status: 'active' }, // → hungry
  { title: 'Shelter', status: 'active' }       // → wet
];

const duckStates = determineAvatarStates(mockAlerts);
// Returns: ['hungry', 'wet']
```

### Future Implementation (Real Data)

```typescript
// When real compliance data is available
interface Question {
  id: string;
  policyType: 'food' | 'water' | 'shelter' | 'rest';
  compliant: boolean;
  requiresRemediation: boolean;
}

const questions: Question[] = [
  { id: 'q1', policyType: 'food', compliant: false, requiresRemediation: true },
  { id: 'q2', policyType: 'shelter', compliant: false, requiresRemediation: true },
  { id: 'q3', policyType: 'water', compliant: true, requiresRemediation: false }
];

// Map policy types to duck states
const policyToStateMap = {
  food: 'hungry',
  water: 'thirsty',
  shelter: 'wet',
  rest: 'tired'
};

// Determine duck states from questions
const duckStates = questions
  .filter(q => !q.compliant && q.requiresRemediation)
  .map(q => policyToStateMap[q.policyType]);

// Returns: ['hungry', 'wet']
```

## User Remediation Flow

### Step 1: User Sees Non-Compliant Duck
```
Dashboard shows:
- Duck in distress state (e.g., hungry + wet)
- Alert: "🍔 Dilly is hungry! Help provide food resources. (2 issues need attention)"
- List of non-compliant questions with "Fix Now" buttons
```

### Step 2: User Takes Action
```
User clicks "Fix Now" on Food Policy question
→ Navigates to questionnaire
→ User provides evidence/answers
→ Question marked as compliant: true
```

### Step 3: Duck State Updates
```
System recalculates compliance:
- Food Policy: compliant = true (resolved)
- Shelter Policy: compliant = false (still needs work)

Duck states update:
- Before: [hungry, wet]
- After: [wet]

Duck animation changes:
- Stops hopping/grumbling (hungry resolved)
- Continues shaking in rain (wet remains)
```

### Step 4: All Issues Resolved
```
User resolves all non-compliant questions
→ All questions: compliant = true
→ Duck state: happy
→ Dashboard shows: "✨ Everything looks great! Dilly is happy!"
```

## Data Structure for Future Integration

### Expected Question/Policy Data Format

```typescript
interface ComplianceQuestion {
  id: string;
  title: string;
  policyType: 'food' | 'water' | 'shelter' | 'rest' | string; // Extensible
  compliant: boolean;
  requiresRemediation: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: number;
  evidence?: {
    provided: boolean;
    documents: string[];
  };
}

interface PolicyMapping {
  policyType: string;
  duckState: AvatarState;
  alertTitle: string;
  alertMessage: string;
  remediationAction: string;
}
```

### Configuration File (To Be Created)

```typescript
// frontend/src/config/policyStateMappings.ts
export const policyStateMappings: PolicyMapping[] = [
  {
    policyType: 'food',
    duckState: 'hungry',
    alertTitle: 'Malnutrition',
    alertMessage: 'Food policy compliance required',
    remediationAction: 'Provide food resources documentation'
  },
  {
    policyType: 'water',
    duckState: 'thirsty',
    alertTitle: 'Water Access',
    alertMessage: 'Water policy compliance required',
    remediationAction: 'Provide water access documentation'
  },
  {
    policyType: 'shelter',
    duckState: 'wet',
    alertTitle: 'Shelter',
    alertMessage: 'Shelter policy compliance required',
    remediationAction: 'Provide housing documentation'
  },
  {
    policyType: 'rest',
    duckState: 'tired',
    alertTitle: 'Rest/Workload',
    alertMessage: 'Rest policy compliance required',
    remediationAction: 'Provide workload documentation'
  }
];
```

## Testing Scenarios

### Scenario 1: All Compliant (Happy Duck)
```typescript
const questions = [
  { policyType: 'food', compliant: true },
  { policyType: 'water', compliant: true },
  { policyType: 'shelter', compliant: true },
  { policyType: 'rest', compliant: true }
];
// Expected: Duck state = happy
```

### Scenario 2: Single Non-Compliant (Hungry Duck)
```typescript
const questions = [
  { policyType: 'food', compliant: false },
  { policyType: 'water', compliant: true },
  { policyType: 'shelter', compliant: true },
  { policyType: 'rest', compliant: true }
];
// Expected: Duck states = [hungry]
```

### Scenario 3: Multiple Non-Compliant (Combined States)
```typescript
const questions = [
  { policyType: 'food', compliant: false },
  { policyType: 'water', compliant: false },
  { policyType: 'shelter', compliant: false },
  { policyType: 'rest', compliant: true }
];
// Expected: Duck states = [hungry, thirsty, wet]
```

### Scenario 4: All Non-Compliant (Maximum Distress)
```typescript
const questions = [
  { policyType: 'food', compliant: false },
  { policyType: 'water', compliant: false },
  { policyType: 'shelter', compliant: false },
  { policyType: 'rest', compliant: false }
];
// Expected: Duck states = [hungry, thirsty, wet, tired]
```

## Next Steps for Implementation

1. **Create Policy Mapping Configuration**
   - Define all policy types and their corresponding duck states
   - Create configuration file with mappings

2. **Update Avatar State Mapper**
   - Modify `determineAvatarStates()` to accept question/policy data
   - Use policy mappings to determine states

3. **Integrate with Backend**
   - Fetch compliance questions from API
   - Calculate duck states based on `compliant` field
   - Update in real-time when questions are resolved

4. **Add State Persistence**
   - Store duck state in Redux/state management
   - Update when compliance data changes
   - Sync across components

5. **Implement Real-Time Updates**
   - WebSocket or polling for live compliance updates
   - Duck state changes immediately when user resolves issues
   - Smooth transitions between states

## Summary

- **Default:** Duck is happy when all questions are compliant
- **Non-Compliant:** Duck enters distress states based on policy type
- **Multiple Issues:** Duck can show combined states (e.g., hungry + wet)
- **Resolution:** Duck returns to happy when user resolves all issues
- **Extensible:** System ready for any number of policy types and mappings
