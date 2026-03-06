# Speech Bubble Overlay Implementation

## Changes Made

### LSEGlingAvatar.tsx Updates

1. **Added speechBubble prop** - Optional string prop to display a message from the duck

2. **Single speech bubble** - When duck has only one state:
   - Positioned at top center (15%) above the duck
   - White background with rounded corners
   - Border color changes based on state (green for happy, primary color for distress)
   - Subtle bounce animation
   - Tail points down to duck's head

3. **Multiple speech bubbles** - When duck has multiple states:
   - Shows one bubble per distress state (excludes happy)
   - Positioned around the duck:
     - First bubble: top center
     - Second bubble: left side
     - Third bubble: right side
     - Fourth bubble: lower left
   - Each bubble has appropriate tail direction (down, right, left)
   - All bubbles show state-specific messages

4. **Speech bubble messages**:
   - Hungry: "I'm so hungry! 🍔"
   - Wet: "I need shelter! 🏠"
   - Thirsty: "I'm so thirsty! 💧"
   - Tired: "I'm exhausted! 😴"
   - Happy: "I'm so happy! Everything is great! 😊"

### Dashboard.tsx Updates

1. **Removed external speech bubble** - Eliminated the separate overlay that was positioned outside the avatar

2. **Added getSpeechBubbleMessage function** - Determines message based on duck state

3. **Conditional speechBubble prop** - Only passes message for single state, lets component handle multiple states internally

4. **Simplified layout** - Removed complex absolute positioning and count message

## Visual Result

### Single State
```
    ┌─────────────────────┐
    │ "I'm so hungry! 🍔" │ ← Single centered bubble
    └──────────▼──────────┘
           
           🐥              ← Duck animation
      (with background)
```

### Multiple States (e.g., Hungry + Wet + Thirsty)
```
    ┌─────────────────┐
    │ "I'm hungry! 🍔"│ ← Top center
    └────────▼────────┘
           
┌──────────────┐      ┌──────────────┐
│"I need       │◄     ►│"I'm thirsty! │
│ shelter! 🏠" │       │     💧"      │
└──────────────┘       └──────────────┘
    Left side    🐥    Right side
                 
           Duck with multiple needs
```

### Four States (Hungry + Wet + Thirsty + Tired)
```
    ┌─────────────────┐
    │ "I'm hungry! 🍔"│ ← Top
    └────────▼────────┘
           
┌──────────────┐      ┌──────────────┐
│"I need       │◄     ►│"I'm thirsty! │
│ shelter! 🏠" │       │     💧"      │
└──────────────┘       └──────────────┘
    Left              Right
           🐥
┌──────────────┐
│"I'm          │◄
│ exhausted!😴"│
└──────────────┘
    Lower left

    Duck with all needs
```

## Testing

To test all configurations:

1. **Single state** - Visit dashboard with one alert, see single centered bubble
2. **Two states** - Resolve some alerts, see two bubbles (top + left)
3. **Three states** - See three bubbles (top + left + right)
4. **Four states** - See all four bubbles positioned around duck
5. **Resolve states** - Click "Fix Now" and answer correctly, bubbles disappear as states resolve
6. **Happy state** - When all resolved, single happy bubble appears
7. Use "Demo Reset" button to test again

## Files Modified

- `frontend/src/components/LSEGlingAvatar.tsx` - Added multi-bubble support with positioning
- `frontend/src/pages/Dashboard.tsx` - Updated to conditionally pass speechBubble prop
