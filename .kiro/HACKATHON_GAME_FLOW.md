# CompliQuest - Hackathon Game Flow & Demo Guide

## 🎮 Complete Game Experience

CompliQuest is a **gamified compliance platform** where users help LSEGling (a cute yellow duck mascot) achieve compliance by completing challenges and addressing gaps. The entire experience is framed as a game quest.

---

## 📊 Dashboard (Game Hub)

**URL**: `http://localhost:5173/`

### Visual Elements:
- **Header**: "CompliQuest - Regulation Compliance for every team" + "View Presentation" button
- **LSEGling Character**: Yellow duck emoji (🐤) with "Remediation required" badge
- **Turquoise Alert Section** (Cyan background):
  - Title: "Your LSEGling needs your attention!!"
  - LSEGling character with remediation badge
  - Alert items showing missing resources:
    - 🍽️ Malnutrition - Missing food
    - 🏠 Shelter - Missing shelter

### Recent Activity Carousel:
- Navigation arrows (◀ ▶)
- Food icon (🍔)
- Activity cards showing:
  - "Bought food - Jane Smith"
  - "Helped team to comply with new EU AI regulation!"

### Gap Detection Section (Pink background):
- Title: "CompliQuest found a gap:"
- Umbrella icon (☂️)
- Gap cards showing:
  - Project name: "Privilege Access Management"
  - Progress bar (green/yellow/red based on score)
  - "Buy shelter" action button

### Completion Section (Magenta background):
- Message: "You're automatically compliant to rest of 95 controls for the new EU AI regulation."
- "Open to see list of other regulations you're compliant with: (Open accordion)"

---

## 🎯 Compliance Challenges Page

**URL**: `http://localhost:5173/projects`

### Visual Elements:
- **Header**: "🎮 Compliance Challenges"
- **Subtitle**: "Help LSEGling complete these quests to protect your community!"
- **"➕ New Challenge" button**

### Challenge Cards:
Each card shows:
- Challenge name (e.g., "AWS Security Compliance")
- Framework type (e.g., "ISO-27001 Challenge")
- 🎯 Target emoji
- Progress bar with percentage
- Controls completed (e.g., "85/114 controls completed")
- "🎮 Play Challenge" button
- "📊 Details" button

### Empty State:
- LSEGling avatar (neutral state)
- Message: "No challenges yet. Help LSEGling by creating one!"
- "🎮 Create Your First Challenge" button

---

## ❓ Questionnaire (Main Game)

**URL**: `http://localhost:5173/questionnaire/{projectId}`

### Top Section:
- **Food Icon** (🍔)
- **Category Name** (e.g., "Privilege Access Management")
- **"+1 Food" button** (action to reward LSEGling)
- **Pink Regulation Panel**:
  - "What regulation is this for?"
  - "(open side panel)"
  - Framework name (e.g., "GDPR")

### Navigation:
- **"← go back" link** to return to challenges

### Question Display:
- Large centered question text
- Example: "How does the solution protect privilege infrastructure access?"

### Answer Options:
Multiple black cards with compliance approaches:
- "SSH Access"
- "Access via a jump host"
- "Saas with vendor"
- "Raw SSH from EUC"
- "Integrated with PAM tool"

### Selected Answer Display:
- Black card showing the selected answer
- Example: "Explicit consent is obtained via a pre-processing opt-in mechanism..."

### Evidence Input:
- Text area: "Upload evidence / provide explanation"
- Placeholder: "Describe how your organization implements this control..."

### Submit Section:
- **"Submit" button** (full width, dark gray)
- **"Skip" button** (alternative)

### Progress Indicator:
- Fixed bottom-right corner
- Pink background
- Shows: "Progress: {score}%"
- Progress bar
- "{completed}/{total} answered"

### Success Animation:
- Green banner with checkmark
- "✅ Great! Your answer is complete!"
- "Your LSEGling was given shelter 🏠"
- Auto-advances to next question after 1.5 seconds

---

## 🎨 Color Scheme & Visual Design

| Section | Color | Purpose |
|---------|-------|---------|
| Alert/Attention | Turquoise (Cyan) | Urgent LSEGling needs |
| Gap Detection | Pink | Compliance gaps found |
| Completion | Magenta | Success & compliance achieved |
| Buttons | Dark Gray/Black | Actions & selections |
| Progress | Indigo | Positive progress |
| Success | Green | Completion confirmation |

---

## 💬 Game Narrative & Messaging

### Dashboard:
- "Your LSEGling needs your attention!!"
- "Remediation required"
- "Missing food" / "Missing shelter"

### Challenges:
- "Help LSEGling complete these quests to protect your community!"
- "🎮 Play Challenge"

### Questionnaire:
- "How does the solution protect privilege infrastructure access?"
- "Your LSEGling was given shelter 🏠"
- "Great! Your answer is complete!"

### Completion:
- "You're automatically compliant to rest of 95 controls for the new EU AI regulation."
- "Open to see list of other regulations you're compliant with"

---

## 🎮 Game Mechanics

### LSEGling States:
- **Neutral** (😐): 0-50% compliance - "Keep going! 🎯"
- **Happy** (😊): 50-75% compliance - "You're doing great! 💪"
- **Celebrating** (🎉): 75%+ compliance - "You're almost there! 🚀"

### Rewards System:
- **+1 Food**: Reward for answering questions
- **Shelter**: Reward for completing challenges
- **Achievements**: Badges for milestones

### Progress Tracking:
- Overall compliance score (0-100%)
- Controls completed vs. total
- Gap detection and remediation
- Recent activity feed

---

## 🚀 Demo Flow

### Step 1: Show Dashboard
1. Navigate to `http://localhost:5173/`
2. Show LSEGling character with remediation badge
3. Highlight turquoise alert section
4. Show recent activity carousel
5. Show gap detection with progress bars
6. Show completion messaging

### Step 2: Show Challenges
1. Click "Play Challenge" or navigate to `/projects`
2. Show challenge cards with progress
3. Highlight game-like design with emojis and colors

### Step 3: Play Questionnaire
1. Click "🎮 Play Challenge" on a challenge card
2. Show top section with food icon and regulation panel
3. Display question
4. Select an answer option
5. Fill in evidence
6. Click Submit
7. Show success animation
8. Auto-advance to next question

### Step 4: Highlight Game Elements
1. Show LSEGling avatar reactions
2. Show progress indicator
3. Show success messages with community impact language
4. Show compliance score updates

---

## 🎯 Key Hackathon Pitch Points

1. **Gamification**: Makes compliance fun and engaging
2. **LSEGling Character**: Emotional connection to compliance journey
3. **Community Impact**: "You protected your community!" messaging
4. **Visual Hierarchy**: Clear, colorful sections for different states
5. **Progress Visualization**: Real-time compliance score updates
6. **Narrative-Driven**: Story-based approach to compliance
7. **Interactive Elements**: Food/shelter rewards, action buttons
8. **Accessibility**: Clear visual indicators and emoji support

---

## 📱 Responsive Design

- **Desktop**: Full layout with all sections visible
- **Tablet**: Stacked sections with carousel navigation
- **Mobile**: Single column with touch-friendly buttons

---

## 🔧 Running the Demo

### Backend (Port 3000)
```bash
cd backend
npm run dev
```

### Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

### Access Points
- Dashboard: http://localhost:5173/
- Challenges: http://localhost:5173/projects
- Questionnaire: http://localhost:5173/questionnaire/{projectId}

---

## 📊 Mock Data

The demo includes:
- 2 sample projects (AWS Security Compliance 75%, Data Protection Initiative 82%)
- Sample compliance scores and controls
- Mock alerts and gaps
- Recent activity feed
- LSEGling character states

---

## ✨ Demo Highlights

- Show LSEGling avatar changing states as compliance increases
- Demonstrate success animations and celebration messages
- Show how narrative prompts guide users through compliance
- Highlight community impact language throughout
- Show progress tracking with visual indicators
- Demonstrate interactive elements (food/shelter rewards)
- Show carousel navigation in recent activity
- Highlight color-coded sections for different states

---

**Status**: Ready for Hackathon Demo
**Last Updated**: March 5, 2026
