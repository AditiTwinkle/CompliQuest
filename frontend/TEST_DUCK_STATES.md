# Testing Duck States

## Current Dashboard State
The dashboard currently shows **both Malnutrition and Shelter alerts**, which means the duck should be in **HUNGRY** state (highest priority).

## How to Test Each State

### 1. Test Hungry Duck
In `frontend/src/pages/Dashboard.tsx`, set alerts to:
```typescript
const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Malnutrition',
    message: 'Missing food',
    severity: 'high',
    status: 'active',
  },
];
```

**Expected behavior:**
- Duck hops up and down
- Head looks down (searching for food)
- Wings wiggle
- Body grumbles (squishes and stretches)

### 2. Test Wet Duck
```typescript
const mockAlerts: Alert[] = [
  {
    id: 'alert-2',
    title: 'Shelter',
    message: 'Missing shelter',
    severity: 'high',
    status: 'active',
  },
];
```

**Expected behavior:**
- Duck shakes rapidly side to side
- Head shakes
- Wings flap vigorously
- Water drops fly off
- Dark rainy background
- Rain falling

### 3. Test Thirsty Duck
```typescript
const mockAlerts: Alert[] = [
  {
    id: 'alert-3',
    title: 'Water Access',
    message: 'Thirsty - need water',
    severity: 'medium',
    status: 'active',
  },
];
```

**Expected behavior:**
- Duck sways sadly
- Head droops down
- Eyes are half-closed and sad
- Wings droop down
- Tears fall from eyes
- Cheeks are faded

### 4. Test Tired Duck
```typescript
const mockAlerts: Alert[] = [
  {
    id: 'alert-4',
    title: 'Fatigue',
    message: 'Tired - workload too high',
    severity: 'medium',
    status: 'active',
  },
];
```

**Expected behavior:**
- Duck sways slowly
- Head nods forward (falling asleep)
- Eyes are nearly closed (sleepy)
- Wings droop

### 5. Test Happy Duck
```typescript
const mockAlerts: Alert[] = [];
```

**Expected behavior:**
- Duck bounces energetically
- Head tilts side to side
- Wings flap happily
- Eyes blink cheerfully
- Cheeks glow brighter
- Sunny background with flowers

## Verification Checklist

For each state, verify:
- [ ] Duck animation matches the state
- [ ] Background changes appropriately (wet = dark/rainy, others = sunny)
- [ ] Status message displays correctly
- [ ] Flowers hide when wet, show otherwise
- [ ] State-specific effects (tears, water drops) appear

## Current Issue Check

If the duck doesn't look hungry/wet:
1. Check browser console for errors
2. Verify the dev server reloaded (`http://localhost:5173/`)
3. Check that `determineAvatarState()` is returning the correct state
4. Add console.log in Dashboard: `console.log('Duck state:', duckState)`
5. Inspect element to see which CSS class is applied to `.avatar-container-{state}`

## Quick Debug

Add this to Dashboard.tsx temporarily:
```typescript
console.log('Alerts:', alerts);
console.log('Duck state:', duckState);
```

This will show you what state the duck should be in.
