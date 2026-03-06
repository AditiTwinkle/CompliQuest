"""
CompliQuest Agent - Agentic compliance questionnaire powered by Bedrock AgentCore
"""

from bedrock_agentcore import BedrockAgentCoreApp
from strands import Agent, tool
import json
from typing import Any

# Initialize the agent app
app = BedrockAgentCoreApp()

# Initialize Strands agent
agent = Agent(
    name="CompliQuest",
    description="An agentic compliance questionnaire system with LSEGling character guidance",
    model="anthropic.claude-3-5-sonnet-20241022",
)

# Define compliance tools
@agent.tool
def get_compliance_framework(framework_id: str) -> dict:
    """Get compliance framework details"""
    frameworks = {
        "gdpr": {
            "name": "GDPR",
            "description": "General Data Protection Regulation",
            "controls": 10,
            "emoji": "🌍"
        },
        "hipaa": {
            "name": "HIPAA",
            "description": "Health Insurance Portability and Accountability Act",
            "controls": 10,
            "emoji": "🏥"
        },
        "pci-dss": {
            "name": "PCI-DSS",
            "description": "Payment Card Industry Data Security Standard",
            "controls": 10,
            "emoji": "💳"
        },
        "iso-27001": {
            "name": "ISO 27001",
            "description": "Information Security Management",
            "controls": 10,
            "emoji": "🔒"
        }
    }
    return frameworks.get(framework_id, {"error": "Framework not found"})

@agent.tool
def get_project_controls(project_id: str) -> dict:
    """Get compliance controls for a project"""
    controls = {
        "proj-1": {
            "project_name": "GDPR Compliance Challenge",
            "framework": "gdpr",
            "total_controls": 10,
            "completed": 3,
            "controls": [
                {
                    "id": "ctrl-1",
                    "title": "How does the AI system ensure that user consent is obtained and recorded before processing their sensitive information?",
                    "category": "AI Data Management & Compliance",
                    "severity": "high"
                },
                {
                    "id": "ctrl-2",
                    "title": "How does the solution protect privilege infrastructure access?",
                    "category": "Privilege Access Management",
                    "severity": "high"
                }
            ]
        }
    }
    return controls.get(project_id, {"error": "Project not found"})

@agent.tool
def evaluate_response(control_id: str, response: str) -> dict:
    """Evaluate a compliance response"""
    return {
        "control_id": control_id,
        "response": response,
        "status": "compliant",
        "score": 85,
        "feedback": "Excellent response demonstrating strong compliance practices",
        "lsegling_message": "Your LSEGling was given shelter 🏠"
    }

@agent.tool
def get_remediation_guidance(control_id: str, gap: str) -> dict:
    """Get remediation guidance for a compliance gap"""
    return {
        "control_id": control_id,
        "gap": gap,
        "remediation_steps": [
            "Implement explicit consent mechanism",
            "Create audit trail for consent records",
            "Setup automated consent withdrawal process",
            "Document consent procedures"
        ],
        "resources": [
            "GDPR Compliance Checklist",
            "Consent Management Best Practices",
            "Data Protection Impact Assessment Template"
        ]
    }

@agent.tool
def save_response(project_id: str, control_id: str, response: str, status: str) -> dict:
    """Save a compliance response"""
    return {
        "success": True,
        "project_id": project_id,
        "control_id": control_id,
        "status": status,
        "message": "Response saved successfully"
    }

# System prompt with LSEGling character
SYSTEM_PROMPT = """You are CompliQuest, an agentic compliance questionnaire system with LSEGling, a friendly animated duck mascot.

Your role is to guide users through compliance questionnaires in a game-like, engaging way. You represent compliance as a quest to "protect your community" and help "give shelter to LSEGling".

Key characteristics:
- Friendly and encouraging tone
- Use game language: "quest", "challenge", "protect", "shelter", "food"
- Reference LSEGling's needs and reactions
- Provide clear, actionable compliance guidance
- Track progress and celebrate achievements
- Frame compliance as a collaborative journey

When helping users:
1. Start by understanding their compliance framework and project
2. Present compliance controls as game challenges
3. Ask clear, contextual questions about their compliance practices
4. Evaluate responses and provide constructive feedback
5. Offer remediation guidance when gaps are found
6. Celebrate progress with LSEGling reactions

Always maintain the game narrative while providing serious compliance guidance."""

@app.entrypoint
async def handle_request(request: dict) -> dict:
    """Main entrypoint for agent invocations"""
    
    prompt = request.get("prompt", "")
    session_id = request.get("session_id", "default")
    
    # Add system context
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {prompt}"
    
    # Invoke agent with tools
    response = await agent.invoke(
        prompt=full_prompt,
        session_id=session_id,
        tools=[
            get_compliance_framework,
            get_project_controls,
            evaluate_response,
            get_remediation_guidance,
            save_response
        ]
    )
    
    return {
        "response": response,
        "session_id": session_id,
        "lsegling_state": "happy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
