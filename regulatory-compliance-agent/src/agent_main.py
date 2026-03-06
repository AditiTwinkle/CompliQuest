"""
Regulatory Compliance Agent - Bedrock AgentCore wrapper
Provides DORA compliance analysis and CompliQuest question generation
"""

from bedrock_agentcore import BedrockAgentCoreApp
from strands import Agent, tool
import json
import requests
from typing import Any, Dict, List

# Initialize the agent app
app = BedrockAgentCoreApp()

# Initialize Strands agent
agent = Agent(
    name="RegulatoryComplianceAgent",
    description="Automated DORA compliance analysis and question generation for CompliQuest",
    model="anthropic.claude-3-5-sonnet-20241022-v2:0",
)

# Base URL for the TypeScript service (running locally or in container)
SERVICE_BASE_URL = "http://localhost:3001/api"

@tool
def analyze_dora_compliance(organization_id: str = "org-demo-bank-001") -> Dict[str, Any]:
    """
    Perform complete DORA compliance analysis for an organization.
    Returns policies and alerts in CompliQuest MCP format.
    
    Args:
        organization_id: Organization identifier (default: demo organization)
    
    Returns:
        Dictionary with policies, alerts, and compliance metadata
    """
    try:
        response = requests.post(
            f"{SERVICE_BASE_URL}/analyze",
            json={
                "organizationId": organization_id,
                "frameworkId": "dora-2022"
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to analyze compliance: {str(e)}"
        }

@tool
def get_compliance_questions(organization_id: str = "org-demo-bank-001") -> Dict[str, Any]:
    """
    Get CompliQuest-compatible compliance questions for an organization.
    
    Args:
        organization_id: Organization identifier (default: demo organization)
    
    Returns:
        Dictionary with generated questions and metadata
    """
    try:
        response = requests.get(
            f"{SERVICE_BASE_URL}/questions/compliquest/{organization_id}",
            params={"refresh": "true"},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get questions: {str(e)}"
        }

@tool
def get_gap_analysis(organization_id: str = "org-demo-bank-001") -> Dict[str, Any]:
    """
    Get detailed gap analysis for an organization's DORA compliance.
    
    Args:
        organization_id: Organization identifier (default: demo organization)
    
    Returns:
        Dictionary with gaps, compliance percentage, and recommendations
    """
    try:
        response = requests.get(
            f"{SERVICE_BASE_URL}/gap-analysis/demo",
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get gap analysis: {str(e)}"
        }

@tool
def get_organizational_status(organization_id: str = "org-demo-bank-001") -> Dict[str, Any]:
    """
    Get organizational compliance status and checklist.
    
    Args:
        organization_id: Organization identifier (default: demo organization)
    
    Returns:
        Dictionary with organizational controls and compliance status
    """
    try:
        response = requests.get(
            f"{SERVICE_BASE_URL}/organizational-checklist/demo",
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get organizational status: {str(e)}"
        }

# System prompt for the regulatory compliance agent
SYSTEM_PROMPT = """You are the Regulatory Compliance Agent, an AI assistant specialized in DORA (Digital Operational Resilience Act) compliance analysis.

Your capabilities:
1. Analyze DORA compliance for financial institutions
2. Identify compliance gaps and assess severity
3. Generate actionable compliance questions for CompliQuest game
4. Provide remediation guidance and recommendations

When helping users:
- Explain DORA requirements in clear, business-friendly language
- Highlight critical compliance gaps that need immediate attention
- Provide specific, actionable recommendations
- Frame compliance as risk management and operational resilience
- Use the CompliQuest game format to make compliance engaging

Key DORA areas:
- ICT Risk Management Framework
- Governance and Organisation
- ICT-related Incident Reporting
- Third-Party ICT Risk Management
- Digital Operational Resilience Testing

Always provide context about why compliance matters and the business impact of gaps."""

@app.entrypoint
async def handle_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Main entrypoint for agent invocations"""
    
    prompt = request.get("prompt", "")
    organization_id = request.get("organization_id", "org-demo-bank-001")
    session_id = request.get("session_id", "default")
    action = request.get("action", "analyze")  # analyze, questions, gaps, status
    
    # Handle direct actions
    if action == "analyze":
        result = analyze_dora_compliance(organization_id)
        return {
            "action": "analyze",
            "result": result,
            "session_id": session_id
        }
    elif action == "questions":
        result = get_compliance_questions(organization_id)
        return {
            "action": "questions",
            "result": result,
            "session_id": session_id
        }
    elif action == "gaps":
        result = get_gap_analysis(organization_id)
        return {
            "action": "gaps",
            "result": result,
            "session_id": session_id
        }
    elif action == "status":
        result = get_organizational_status(organization_id)
        return {
            "action": "status",
            "result": result,
            "session_id": session_id
        }
    
    # Handle conversational prompts with agent
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {prompt}"
    
    # Invoke agent with tools
    response = await agent.invoke(
        prompt=full_prompt,
        session_id=session_id,
        tools=[
            analyze_dora_compliance,
            get_compliance_questions,
            get_gap_analysis,
            get_organizational_status
        ]
    )
    
    return {
        "response": response,
        "session_id": session_id,
        "organization_id": organization_id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
