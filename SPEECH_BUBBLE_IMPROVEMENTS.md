# Speech Bubble Improvements

## Changes Made

### 1. Truncated Speech Bubble Text
- Reduced padding: `8px 14px` (was `12px 20px`)
- Smaller max-width: `160px` (was `200px`)
- Smaller font size: `13px` (was default)
- More concise messages:
  - "I'm hungry! 🍔" (was "I'm so hungry! 🍔")
  - "Need shelter! 🏠" (was "I need shelter! 🏠")
  - "I'm thirsty! 💧" (was "I'm so thirsty! 💧")
  - "So tired! 😴" (was "I'm exhausted! 😴")
  - "I'm so happy! 😊" (was "I'm so happy! Everything is great! 😊")

### 2. Clearer and Larger Arrow Tails
- Increased arrow size:
  - Outer triangle: `15px` borders (was `12px`)
  - Outer height: `18px` (was `15px`)
  - Inner triangle: `11px` borders (was `9px`)
  - Inner height: `14px` (was `12px`)
- Better positioning for clarity
- More prominent visual connection to duck

### 3. Improved Spacing
- Single bubble positioned higher: `top: 8%` (was `15%`)
- Multiple bubbles with better spacing:
  - Top bubble: `top: 5%` (was `10%`)
  - Left bubbles: `left: -8%` (was `5%` and `2%`)
  - Right bubble: `right: -8%` (was `5%`)
  - Lower bubble: `top: 45%` (was `35%`)
- More space between bubbles and duck for clarity

### 4. Dynamic Alert Count in Heading
- Updated heading to show count: "🚨 Your LSEGling needs help! (X issues)"
- Proper singular/plural handling:
  - 1 issue: "(1 issue)"
  - 2+ issues: "(2 issues)", "(3 issues)", etc.
- Count updates dynamically as alerts are resolved

## Visual Result

### Single Issue
```
Heading: 🚨 Your LSEGling needs help! (1 issue)

    ┌──────────────┐
    │ I'm hungry! 🍔│ ← Compact bubble
    └──────▼───────┘   Larger arrow
           ▼
           
         🐥
```

### Multiple Issues (3 issues)
```
Heading: 🚨 Your LSEGling needs help! (3 issues)

       ┌──────────┐
       │I'm hungry│ ← Top
       │    🍔    │
       └────▼─────┘
            ▼
            
┌──────────┐      ┌──────────┐
│Need      │►     ◄│I'm       │
│shelter!🏠│       │thirsty!💧│
└──────────┘       └──────────┘
   Left      🐥       Right
   
   More spacing between bubbles
```

### Four Issues
```
Heading: 🚨 Your LSEGling needs help! (4 issues)

       ┌──────────┐
       │I'm hungry│
       │    🍔    │
       └────▼─────┘
            
┌──────────┐      ┌──────────┐
│Need      │►     ◄│I'm       │
│shelter!🏠│       │thirsty!💧│
└──────────┘       └──────────┘
            🐥
┌──────────┐
│So tired! │►
│    😴    │
└──────────┘
   Lower left
```

## Benefits

1. **More readable** - Truncated text is easier to scan quickly
2. **Clearer arrows** - Larger tails make it obvious which bubble belongs to the duck
3. **Better spacing** - Bubbles don't crowd the duck, easier to see all messages
4. **Informative heading** - Users immediately know how many issues need attention
5. **Dynamic updates** - Count decreases as issues are resolved, providing feedback

## Testing

1. Start with 4 alerts - heading shows "(4 issues)", 4 bubbles around duck
2. Resolve one alert - heading updates to "(3 issues)", 3 bubbles remain
3. Resolve another - heading shows "(2 issues)", 2 bubbles
4. Resolve another - heading shows "(1 issue)", 1 centered bubble
5. Resolve last one - heading changes to "✨ Everything looks great!", happy bubble

## Files Modified

- `frontend/src/components/LSEGlingAvatar.tsx` - Truncated text, larger arrows, better spacing
- `frontend/src/pages/Dashboard.tsx` - Added dynamic alert count to heading, shortened messages
