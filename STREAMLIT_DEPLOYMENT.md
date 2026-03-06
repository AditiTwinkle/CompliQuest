# CompliQuest - Streamlit Deployment Guide

## Overview
This is a Streamlit version of CompliQuest, a gamified compliance questionnaire game with LSEGling character. It demonstrates the core gameplay without requiring AWS Bedrock AgentCore deployment.

## Features
✅ **Gamified Interface** - Game-like UI with progress tracking and achievements
✅ **LSEGling Character** - Animated duck mascot with emotional states
✅ **Multiple Frameworks** - GDPR, HIPAA, PCI-DSS compliance frameworks
✅ **Interactive Questionnaire** - Answer controls with AI-style feedback
✅ **Achievement System** - Unlock badges as you progress
✅ **Chat History** - Track your compliance journey
✅ **No AWS Required** - Runs entirely locally or on Streamlit Cloud

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Locally
```bash
streamlit run streamlit_app.py
```

### 3. Open in Browser
- Navigate to `http://localhost:8501`
- The app will open automatically

## How to Play

### Step 1: Choose Your Quest
- Select a compliance framework (GDPR, HIPAA, or PCI-DSS)
- Each framework has 5 controls to complete

### Step 2: Answer Controls
- Read each compliance control question
- Provide detailed responses about your organization's practices
- Use hints and examples for guidance

### Step 3: Get Feedback
- Receive AI-style evaluation with scores (70-95)
- Get LSEGling character reactions
- See improvement suggestions

### Step 4: Earn Achievements
- Unlock badges for milestones
- Track your progress
- Complete all 5 controls to finish the quest

## Deployment Options

### Option 1: Streamlit Cloud (Recommended)
1. Push code to GitHub repository
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your GitHub repository
4. Set main file to `streamlit_app.py`
5. Deploy!

### Option 2: Hugging Face Spaces
1. Create a new Space on Hugging Face
2. Select "Streamlit" as SDK
3. Upload `streamlit_app.py` and `requirements.txt`
4. Add any additional assets
5. Deploy!

### Option 3: Local Server
```bash
# Run with custom port
streamlit run streamlit_app.py --server.port 8080

# Run with sharing enabled
streamlit run streamlit_app.py --server.enableCORS false --server.enableXsrfProtection false
```

## Game Components

### 1. LSEGling Character
- **Happy** 🦆 - Welcome message
- **Thinking** 🤔 - When getting guidance
- **Excited** 🎉 - After good answers
- **Concerned** 😟 - When gaps are identified
- **Celebrating** 🎊 - Quest completion

### 2. Compliance Frameworks
- **GDPR** 🌍 - Data protection regulation
- **HIPAA** 🏥 - Healthcare privacy
- **PCI-DSS** 💳 - Payment card security

### 3. Achievements
- **First Quest** 🎯 - Start your first compliance quest
- **Halfway Hero** 🏆 - Complete 50% of controls
- **Perfect Protector** ⭐ - Achieve 100% compliance score
- **Quick Thinker** ⚡ - Complete in under 5 minutes
- **Framework Master** 👑 - Complete all controls

### 4. Scoring System
- **70-79** - Needs improvement
- **80-89** - Compliant
- **90-100** - Excellent
- Bonus points for using compliance keywords

## Customization

### Add New Frameworks
Edit the `COMPLIANCE_FRAMEWORKS` dictionary in `streamlit_app.py`:
```python
COMPLIANCE_FRAMEWORKS["new-framework"] = {
    "name": "New Framework",
    "description": "Description here",
    "controls": 5,
    "emoji": "🔒",
    "color": "#HEXCODE"
}
```

### Add New Controls
Edit the `COMPLIANCE_CONTROLS` dictionary:
```python
COMPLIANCE_CONTROLS["framework-id"] = [
    {
        "id": "control-1",
        "title": "Control question",
        "category": "Category",
        "severity": "high/medium/low",
        "hint": "Helpful hint"
    }
]
```

### Modify Scoring Logic
Edit the `evaluate_response()` function to change how responses are scored.

## Integration with AWS Bedrock (Optional)

To connect to real AWS Bedrock for AI responses:

1. **Configure AWS Credentials**:
```bash
aws configure
```

2. **Install Bedrock Dependencies**:
```bash
pip install boto3 botocore
```

3. **Modify `evaluate_response()` function** to call Bedrock API:
```python
import boto3
from botocore.exceptions import ClientError

def evaluate_with_bedrock(control_id, response):
    bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
    
    prompt = f"""
    Evaluate this compliance response for control {control_id}:
    
    Response: {response}
    
    Provide:
    1. Compliance score (0-100)
    2. Status (compliant/non-compliant/partial)
    3. Specific feedback
    4. Improvement suggestions
    """
    
    # Call Bedrock API
    # ... implementation ...
```

## Performance Tips

1. **Caching**: Use `@st.cache_data` for expensive computations
2. **Session State**: Store game state in `st.session_state`
3. **Batch Updates**: Minimize reruns with careful state management
4. **Asset Optimization**: Compress images and use CDN for static assets

## Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
streamlit run streamlit_app.py --server.port 8502
```

2. **Missing dependencies**:
```bash
pip install --upgrade -r requirements.txt
```

3. **Streamlit version issues**:
```bash
pip install streamlit==1.28.0
```

4. **AWS credentials not found**:
- Set environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Or use `aws configure`

### Debug Mode
```bash
streamlit run streamlit_app.py --logger.level=debug
```

## Security Considerations

1. **No sensitive data**: This is a demo - don't enter real compliance data
2. **Local storage**: Game state is stored in browser session only
3. **No authentication**: Add authentication for production use
4. **Input validation**: Sanitize user inputs if storing data

## Extending the Game

### Future Enhancements
1. **Multi-player mode** - Compete with colleagues
2. **Real AI integration** - Connect to Claude 3.5 via Bedrock
3. **Database backend** - Store responses and progress
4. **Report generation** - Export compliance reports
5. **Team dashboards** - Track organizational compliance

### Adding New Features
1. **New game mechanics**: Add time limits, difficulty levels
2. **More frameworks**: ISO 27001, SOC 2, NIST, etc.
3. **Advanced scoring**: NLP-based evaluation
4. **Remediation planner**: Generate action plans from gaps

## Support
- **Documentation**: See code comments and this guide
- **Issues**: Check Streamlit documentation
- **Community**: Streamlit community forum
- **Updates**: Check for package updates regularly

## License
This is a demo application for educational purposes. Modify and use as needed.

---
**Happy compliance questing! 🦆**