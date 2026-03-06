# Duck Avatar State Logic

## Overview
The LSEGling duck avatar (Dilly) dynamically changes its animation state based on compliance status in the system. This provides visual feedback to users about what needs attention.

## Core Workflow Logic

### Default State: Happy
- **Condition:** All questions are `compliant = true`
- **Meaning:** No actions or remediation needed
- **Animation:** Cheerful bouncing, happy expression
- **User Action:** None required

### Non-Compliant States
When `compliant = false`, the duck enters distress state(s) based on the policy type:
## Priority Order

When multiple alerts exist, all states are shown simultaneously (multi-state support):

**Example:** Malnutrition + Shelter alerts
- Duck shows: `['hungry', 'wet']`
- Animations: Hopping (hungry) + Shaking (wet) + Rain (wet)
- Background: Dark/rainy (wet takes priority for environment)

## Multi-State Combinations

The duck can show any combination of states:
- Single: `[hungry]`, `[wet]`, `[thirsty]`, `[tired]`
- Dual: `[hungry, wet]`, `[hungry, thirsty]`, `[wet, tired]`, etc.
- Triple: `[hungry, thirsty, wet]`, `[hungry, wet, tired]`, etc.
- All: `[hungry, thirsty, wet, tired]` - Maximum distress
1. User sees non-compliant duck in distress state
2. User clicks "Fix Now" and resolves the issue
3. Question becomes `compliant = true`
4. Duck state updates (removes resolved state)
5. When all resolved → duck returns to `happy`

## State Mapping

| Alert Type | Keywords | Duck State | Animation |
|------------|----------|------------|-----------|
| Malnutrition | malnutrition, food, hungry, nutrition | `hungry` | Hopping, looking down, stomach grumbling |
| Shelter | shelter, housing, wet, homeless | `wet` | Shaking off water, flapping wings |
| Water Access | thirst, water, hydration, drink | `thirsty` | Sad, droopy, tears falling |
| Fatigue | tired, fatigue, exhausted, sleep | `tired` | Sleepy, nodding off, droopy eyes |
| No Alerts | (none) | `happy` | Cheerful bouncing, happy expression |

## Priority Order

When multiple alerts exist, the duck shows the highest priority state:

1. **Hungry** (malnutrition) - Most critical
2. **Wet** (shelter) - High priority
3. **Thirsty** (water) - Medium priority
4. **Tired** (fatigue) - Lower priority
5. **Happy** (no issues) - Default


Happy - compliant true/false
Thirsty - compliant true/false
Tired - compliant true /false
Wet - compliant true/fasle
Hungry - compliant true/false
ge
## Implementation

### Core Files

1. **`frontend/src/utils/avatarStateMapper.ts`**
   - `determineAvatarState(alerts)` - Returns single state based on priority
   - `getAllAvatarStates(alerts)` - Returns all applicable states (for future multi-state support)

2. **`frontend/src/components/LSEGlingAvatar.tsx`**
   - React component with 5 animated states
   - Supports sizes: small, medium, large
   - Includes inline CSS animations

3. **`frontend/src/pages/Dashboard.tsx`**
   - Uses `determineAvatarState()` to set duck state
   - Shows contextual messages based on state
   - Displays happy duck when no alerts exist

### Usage Example

```typescript
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import { determineAvatarState } from '../utils/avatarStateMapper';
## Future Enhancements

### Backend Integration
When connected to real compliance data:

```typescript
// Fetch compliance questions from API
const questions = await fetchComplianceQuestions();
// Example: [
//   { id: 'q1', policyType: 'food', compliant: false },
//   { id: 'q2', policyType: 'shelter', compliant: false },
//   { id: 'q3', policyType: 'water', compliant: true }
// ]

// Use policy mappings to determine states
import { getDuckStatesFromQuestions } from './config/policyStateMappings';
const duckStates = getDuckStatesFromQuestions(questions);
// Returns: ['hungry', 'wet']

// Render duck
<LSEGlingAvatar states={duckStates} />
```

### Policy Type Mappings
Each policy change will be mapped to a duck state. Configuration is ready in:
- `frontend/src/config/policyStateMappings.ts`

To add new policy types:
1. Add entry to `policyStateMappings` array
2. Define policy type, duck state, and remediation action
3. System automatically uses new mapping

### Real-Time Updates
- WebSocket or polling for live compliance updates
- Duck state changes immediately when user resolves issues
- Smooth transitions between states

## Documentation Files

- **DUCK_STATE_WORKFLOW.md** - Complete workflow logic and data structures
- **MULTI_STATE_DUCK.md** - Multi-state implementation details
- **TEST_DUCK_STATES.md** - Testing different states
- **frontend/src/config/policyStateMappings.ts** - Policy configurationionAndShelter;
```

## Future Enhancements

### Multi-State Support
Currently, the duck shows one state at a time based on priority. Future versions could support combined states:

- **Hungry + Wet**: Duck shaking while looking for food
- **Thirsty + Tired**: Sleepy duck with dry mouth
- **All Issues**: Distressed duck needing immediate help

To implement this, use `getAllAvatarStates()` and create combined animation classes.

### Backend Integration
When connected to real backend data:

1. Fetch alerts from `/api/alerts` endpoint
2. Pass to `determineAvatarState()`
3. Duck updates automatically when alerts change

```typescript
useEffect(() => {
  const fetchAlerts = async () => {
    const response = await fetch('/api/alerts');
    const data = await response.json();
    setAlerts(data.alerts);
  };
  fetchAlerts();
}, []);

const duckState = determineAvatarState(alerts);
```

### Custom Alert Mappings
To add new alert types:

1. Update `avatarStateMapper.ts` with new keywords
2. Add new state to `AvatarState` type if needed
3. Create animation in `LSEGlingAvatar.tsx`

## Animation Details

Each state has unique CSS animations defined inline in the component:

- **Happy**: `happyBounce` - Energetic bouncing (0.6s)
- **Hungry**: `hungryHop` - Hopping with stomach grumble (1.5s)
- **Thirsty**: `thirstySadSway` - Sad swaying (3s)
- **Tired**: `tiredSway` - Slow drowsy sway (4s)
- **Wet**: `wetShake` - Fast shaking motion (0.4s)

## Accessibility

The avatar includes:
- Descriptive text labels for each state
- Semantic HTML structure
- Keyboard-accessible controls (when interactive)
- Screen reader friendly status messages
