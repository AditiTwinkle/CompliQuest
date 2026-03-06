# 🎯 Regulatory Compliance Agent - Hackathon Demo Guide

## 🚀 Quick Start (15 Minutes)

### Step 1: Start the Server
```bash
cd regulatory-compliance-agent
npm install
npm run dev
```

Server will start on: `http://localhost:3001`

### Step 2: Test the Main Endpoint

**API Call:**
```bash
POST http://localhost:3001/api/analyze
Content-Type: application/json

{
  "organizationId": "org-demo-bank-001",
  "frameworkId": "dora-2022"
}
```

**Or using curl:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"organizationId":"org-demo-bank-001","frameworkId":"dora-2022"}'
```

---

## 📊 What Happens Behind the Scenes

### Complete Workflow (Automated):

1. **DORA Scraping** 🌐
   - Extracts 126 regulatory requirements from EU DORA regulation
   - Parses requirement text, section numbers, categories, severity levels
   - Duration: ~9 seconds

2. **Gap Analysis** 🔍
   - Compares 126 DORA requirements against 13 organizational controls
   - Identifies 68 compliance gaps using keyword matching
   - Calculates 53% compliance percentage
   - Duration: ~2 seconds

3. **Question Generation** 📝
   - Prioritizes high-severity gaps (59 high-priority gaps found)
   - Generates exactly 4 CompliQuest-compatible questions
   - Adds gamification elements (icons, success messages, points)
   - Duration: <1 second

4. **CompliQuest Integration** 🎮
   - Transforms questions into PolicyConfig format
   - Creates alerts from high-priority gaps
   - Returns MCP-compatible JSON response

**Total Duration:** ~12 seconds

---

## 🎮 CompliQuest Integration Format

### Response Structure:

```json
{
  "success": true,
  "policies": [
    {
      "id": "1",
      "title": "Operational Resilience",
      "question": "Your organization lacks adequate controls...",
      "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1",
      "complianceProperty": "dora-policy-1-compliant",
      "icon": "💪",
      "successMessage": "Your operational resilience is improved!",
      "severity": "critical"
    }
    // ... 3 more policies
  ],
  "alerts": [
    {
      "id": "policy-1",
      "title": "Operational Resilience",
      "message": "No organizational control found...",
      "severity": "critical",
      "status": "open"
    }
    // ... 3 more alerts
  ],
  "timestamp": "2026-03-06T14:30:00.000Z",
  "metadata": {
    "organizationId": "org-demo-bank-001",
    "organizationName": "Demo Financial Services Ltd",
    "frameworkId": "dora-2022",
    "frameworkName": "Digital Operational Resilience Act (DORA)",
    "compliance": {
      "overallPercentage": 53,
      "totalGaps": 68,
      "highPriorityGaps": 59
    }
  }
}
```

---

## 🎯 Demo Talking Points

### 1. Problem Statement
"Financial institutions struggle to keep up with evolving regulatory requirements like DORA. Manual compliance assessment is time-consuming and error-prone."

### 2. Solution
"Our Regulatory Compliance Agent automates the entire compliance assessment workflow:
- Automatically scrapes current DORA requirements
- Analyzes organizational gaps
- Generates actionable compliance questions for CompliQuest game"

### 3. Key Features
- ✅ **Automated DORA Scraping**: 126 requirements extracted in real-time
- ✅ **Intelligent Gap Analysis**: 68 gaps identified with severity levels
- ✅ **Dynamic Question Generation**: 4 prioritized questions for immediate action
- ✅ **CompliQuest Integration**: Ready-to-use MCP format with gamification

### 4. Demo Results
- **Organization**: Demo Financial Services Ltd (mid-size bank)
- **Current Compliance**: 53%
- **Gaps Identified**: 68 total (59 high-priority)
- **Questions Generated**: 4 actionable compliance questions
- **Categories Covered**: Operational Resilience, Risk Management, Incident Management, Vendor Management

### 5. Business Impact
- **Time Saved**: Manual assessment takes days → Automated in 12 seconds
- **Accuracy**: Real-time regulatory updates vs. outdated manual checklists
- **Engagement**: Gamified questions make compliance training interactive
- **Scalability**: Works for any organization size, any regulatory framework

---

## 🔧 Technical Architecture

### Tech Stack:
- **Backend**: TypeScript + Node.js + Express.js
- **Web Scraping**: Puppeteer + Cheerio
- **AI Integration**: AWS Bedrock (Claude 3.5 Sonnet) - Ready for enhancement
- **Data Processing**: In-memory (MVP) → Can scale to database

### API Endpoints:
1. `POST /api/analyze` - Main compliance analysis workflow
2. `GET /api/health` - Health check
3. `POST /api/scraping/dora` - DORA scraping only
4. `POST /api/gap-analysis/analyze` - Gap analysis only
5. `POST /api/questions/generate` - Question generation only

---

## 📈 Scalability & Future Enhancements

### Current MVP:
- ✅ DORA framework support
- ✅ Template-based question generation
- ✅ In-memory data storage
- ✅ Mock organizational data

### Future Enhancements:
- 🔄 AWS Bedrock AI integration for intelligent question generation
- 🔄 Multi-framework support (GDPR, HIPAA, PCI-DSS, ISO 27001)
- 🔄 Real organizational data integration
- 🔄 Database persistence (PostgreSQL/DynamoDB)
- 🔄 Real-time updates via WebSocket
- 🔄 Advanced analytics dashboard
- 🔄 Multi-language support

---

## 🎬 Demo Script (5 Minutes)

### Minute 1: Problem Introduction
"Financial institutions face complex regulatory compliance challenges. DORA requires operational resilience, but manual assessment is slow and error-prone."

### Minute 2: Solution Overview
"Our agent automates the entire workflow: scrape regulations → analyze gaps → generate questions."

### Minute 3: Live Demo
1. Show API call: `POST /api/analyze`
2. Highlight response: 4 policies + 4 alerts
3. Show metadata: 53% compliance, 68 gaps identified

### Minute 4: CompliQuest Integration
"The response is ready for CompliQuest game integration:
- Policies with questions and answer options
- Alerts for dashboard notifications
- Gamification elements (icons, success messages, points)"

### Minute 5: Business Value
"12 seconds vs. days of manual work. Real-time regulatory updates. Engaging compliance training through gamification."

---

## 🐛 Troubleshooting

### Issue: Server won't start
**Solution**: 
```bash
cd regulatory-compliance-agent
rm -rf node_modules
npm install
npm run dev
```

### Issue: DORA scraping fails
**Solution**: The system automatically falls back to mock DORA data (5 core requirements) for reliable demo.

### Issue: Port 3001 already in use
**Solution**: 
```bash
# Change port in .env file
PORT=3002
```

---

## 📞 Support

For questions during the hackathon:
- Check logs: `regulatory-compliance-agent/logs/app.log`
- API documentation: See `DEMO_API_RESPONSE.json` for example output
- Integration guide: See CompliQuest MCP Integration Guide

---

## ✅ Pre-Demo Checklist

- [ ] Server running on port 3001
- [ ] Test API call returns 200 OK
- [ ] Response contains 4 policies and 4 alerts
- [ ] Metadata shows 53% compliance
- [ ] All icons and success messages present
- [ ] Timestamp is current

---

## 🎉 Success Metrics

**Demo is successful if:**
- ✅ API responds in <15 seconds
- ✅ Returns exactly 4 policies in CompliQuest format
- ✅ Shows realistic compliance data (53% with 68 gaps)
- ✅ Demonstrates end-to-end workflow
- ✅ Audience understands business value

**Good luck with your hackathon demo! 🚀**
