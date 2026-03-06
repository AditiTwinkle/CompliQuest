# Multi-State Duck Implementation

## What Changed

The duck avatar now supports **multiple simultaneous states**, so it can show combined animations when there are multiple compliance issues.

## How It Works

### Before (Single State)
- Dashboard had both "Malnutrition" and "Shelter" alerts
- Duck only showed "hungry" state (highest priority)
- Shelter issue was ignored

### After (Multi-State)
- Dashboard has both "Malnutrition" and "Shelter" alerts
- Duck shows **BOTH hungry AND wet** animations simultaneously:
  - Hopping (hungry)
  - Body grumbling (hungry)
  - Shaking (wet)
  - Water drops flying off (wet)
  - Dark rainy background (wet)
  - Rain falling (wet)

## Current Dashboard State

With the current mock data (Malnutrition + Shelter), you should see:
- **Hungry animations**: Hopping, head looking down, body grumbling
- **Wet animations**: Shaking, water drops, rain, dark sky
- Message: "🍔 Dilly is hungry! Help provide food resources. (2 issues need attention)"

## API Changes

### LSEGlingAvatar Component

**New prop:**
```typescript
states?: AvatarState[]  // Array of states for multi-state support
```

**Usage:**
```typescript
// Single state (backward compatible)
<LSEGlingAvatar state="hungry" />

// Multiple states (new)
<LSEGlingAvatar states={['hungry', 'wet']} />
```

### Avatar State Mapper

**New function:**
```typescript
determineAvatarStates(alerts: Alert[]): AvatarState[]
```

Returns all applicable states based on alerts.

**Example:**
```typescript
const alerts = [
  { title: 'Malnutrition', ... },
  { title: 'Shelter', ... }
];

const states = determineAvatarStates(alerts);
// Returns: ['hungry', 'wet']
```

## CSS Implementation

The component now applies multiple CSS classes:
```html
<div class="avatar-container avatar-container-hungry avatar-container-wet">
```

Each state's animations are applied independently, so they combine naturally:
- `.avatar-container-hungry .chick-container` → hopping animation
- `.avatar-container-wet .chick-container` → shaking animation
- Both animations run simultaneously!

## State Combinations

### Possible Combinations

1. **Hungry + Wet** (current): Hopping while shaking in rain
2. **Hungry + Thirsty**: Hopping with tears falling
3. **Tired + Wet**: Sleepy duck shaking in rain
4. **Hungry + Wet + Thirsty**: All three animations combined
5. **All states**: Maximum distress (all animations)

### Visual Priority

When multiple states are active:
- **Background**: Wet state takes priority (dark/rainy)
- **Flowers**: Hidden if wet, shown otherwise
- **Animations**: All state animations run simultaneously
- **Effects**: All effects show (tears, water drops, etc.)

## Testing Multi-State

### Test Hungry + Wet (Current)
```typescript
const mockAlerts = [
  { title: 'Malnutrition', message: 'Missing food', severity: 'high', status: 'active' },
  { title: 'Shelter', message: 'Missing shelter', severity: 'high', status: 'active' }
];
```

### Test Hungry + Thirsty
```typescript
const mockAlerts = [
  { title: 'Malnutrition', message: 'Missing food', severity: 'high', status: 'active' },
  { title: 'Water Access', message: 'Thirsty', severity: 'medium', status: 'active' }
];
```

### Test All States
```typescript
const mockAlerts = [
  { title: 'Malnutrition', message: 'Missing food', severity: 'critical', status: 'active' },
  { title: 'Shelter', message: 'Missing shelter', severity: 'high', status: 'active' },
  { title: 'Water Access', message: 'Thirsty', severity: 'medium', status: 'active' },
  { title: 'Fatigue', message: 'Tired', severity: 'low', status: 'active' }
];
```

## Removed Features

- Removed status text below duck (was showing "🍞 Dilly is Hungry - Tummy is grumbling...!")
- Status message now only appears in the alert section above the duck

## Benefits

1. **More accurate representation**: Shows all issues, not just the highest priority
2. **Visual richness**: Combined animations create more engaging feedback
3. **Better UX**: Users can see at a glance that multiple issues need attention
4. **Scalable**: Easy to add more state combinations in the future

## Browser Check

Visit `http://localhost:5173/` to see:
- Duck hopping AND shaking
- Body grumbling
- Water drops flying off
- Rain falling
- Dark stormy background
- Message showing "2 issues need attention"
