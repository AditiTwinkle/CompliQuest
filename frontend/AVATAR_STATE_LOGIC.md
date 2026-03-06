# Duck Avatar State Logic

## Overview
The LSEGling duck avatar (Dilly) dynamically changes its animation state based on compliance alerts in the system. This provides visual feedback to users about what needs attention.

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

// In your component
const alerts = [
  { title: 'Malnutrition', message: 'Missing food', severity: 'high', status: 'active' },
  { title: 'Shelter', message: 'Missing shelter', severity: 'high', status: 'active' }
];

const duckState = determineAvatarState(alerts); // Returns 'hungry'

<LSEGlingAvatar state={duckState} size="large" />
```

## Testing Different States

To test different duck states, modify the mock alerts in `Dashboard.tsx`:

```typescript
// Test hungry duck
const mockAlerts = [
  { id: '1', title: 'Malnutrition', message: 'Missing food', severity: 'high', status: 'active' }
];

// Test wet duck
const mockAlerts = [
  { id: '1', title: 'Shelter', message: 'Missing shelter', severity: 'high', status: 'active' }
];

// Test happy duck
const mockAlerts = [];
```

Or use the predefined scenarios from `mockAlertScenarios.ts`:

```typescript
import { alertScenarios } from '../utils/mockAlertScenarios';

const mockAlerts = alertScenarios.malnutritionAndShelter;
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
