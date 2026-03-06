# Duck Animation Fix

## Issue Fixed
The hungry (malnutrition) state animations were not working because the CSS selectors were targeting `.chick-wing` but the actual HTML elements have classes `.chick-wing-left` and `.chick-wing-right`.

## Changes Made

### 1. Fixed Wing Selectors
**Before:**
```css
.avatar-container-hungry .chick-wing { animation: hungryWiggle 0.6s ease-in-out infinite; }
.avatar-container-thirsty .chick-wing { animation: sadDroop 3s ease-in-out infinite; }
.avatar-container-tired .chick-wing { animation: tiredDroop 4s ease-in-out infinite; }
```

**After:**
```css
.avatar-container-hungry .chick-wing-left { animation: hungryWiggle 0.6s ease-in-out infinite; }
.avatar-container-hungry .chick-wing-right { animation: hungryWiggleRight 0.6s ease-in-out infinite; }
.avatar-container-thirsty .chick-wing-left { animation: sadDroop 3s ease-in-out infinite; }
.avatar-container-thirsty .chick-wing-right { animation: sadDroop 3s ease-in-out infinite; }
.avatar-container-tired .chick-wing-left { animation: tiredDroop 4s ease-in-out infinite; }
.avatar-container-tired .chick-wing-right { animation: tiredDroop 4s ease-in-out infinite; }
```

### 2. Added Separate Right Wing Animation for Hungry
Created `hungryWiggleRight` animation for the right wing to mirror the left wing movement.

## Hungry State Animations Now Working

When duck is in hungry state, you should now see:

1. **Hopping** - Duck hops up and down (`hungryHop`)
2. **Head Looking Down** - Head tilts down looking for food (`hungryLookDown`)
3. **Wings Wiggling** - Both wings wiggle back and forth (`hungryWiggle` + `hungryWiggleRight`)
4. **Stomach Grumbling** - Body squishes and stretches (`stomachGrumble`)

## How to Test

### Test Hungry State Only
1. Open Dashboard (`http://localhost:5173/`)
2. Click "Resolve ✓" on Shelter, Water Access, and Fatigue alerts
3. Only Malnutrition alert remains
4. Duck should show:
   - Hopping motion
   - Head looking down
   - Wings wiggling
   - Body grumbling/squishing

### Test All States
1. Refresh page to see all 4 alerts
2. Duck should show combined animations:
   - Hopping (hungry)
   - Shaking (wet)
   - Tears (thirsty)
   - Sleepy eyes (tired)

### Verify Fix
Open browser DevTools and inspect the duck:
- Container should have class: `avatar-container avatar-container-hungry ...`
- Wings should have classes: `chick-wing chick-wing-left` and `chick-wing chick-wing-right`
- Check Computed styles to see animations applied

## Animation Details

### Hungry Hop
```css
@keyframes hungryHop {
  0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
  20% { transform: translateX(-50%) translateY(-5px) rotate(-1deg); }
  40% { transform: translateX(-50%) translateY(0) rotate(0deg); }
  55% { transform: translateX(-50%) translateY(2px) rotate(0deg); }
  60% { transform: translateX(-50%) translateY(-2px) rotate(1deg); }
  65% { transform: translateX(-50%) translateY(2px) rotate(-1deg); }
  75% { transform: translateX(-50%) translateY(0) rotate(0deg); }
}
```
Duration: 1.5s, creates a hopping/bouncing effect

### Hungry Look Down
```css
@keyframes hungryLookDown {
  0%, 40%, 100% { transform: translateX(-50%) rotate(0deg); }
  50% { transform: translateX(-50%) rotate(10deg) translateY(3px); }
  70% { transform: translateX(-50%) rotate(5deg) translateY(1px); }
}
```
Duration: 2s, head tilts down looking for food

### Hungry Wiggle (Wings)
```css
@keyframes hungryWiggle {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(-25deg); }
}

@keyframes hungryWiggleRight {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(25deg); }
}
```
Duration: 0.6s, wings wiggle back and forth

### Stomach Grumble
```css
@keyframes stomachGrumble {
  0%, 45%, 80%, 100% { transform: scale(1); border-radius: 50%; }
  50% { transform: scale(1.06, 0.96); border-radius: 48%; }
  55% { transform: scale(0.97, 1.04); border-radius: 50%; }
  60% { transform: scale(1.04, 0.97); border-radius: 49%; }
  65% { transform: scale(0.98, 1.03); border-radius: 50%; }
  70% { transform: scale(1.02, 0.99); border-radius: 50%; }
}
```
Duration: 1.5s, body squishes and stretches like a grumbling stomach

## All States Fixed

This fix also corrected the wing animations for:
- **Thirsty state** - Wings droop down sadly
- **Tired state** - Wings droop down sleepily

All animations should now work correctly!
