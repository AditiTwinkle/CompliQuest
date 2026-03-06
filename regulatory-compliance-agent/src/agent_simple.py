"""
Simplified Regulatory Compliance Agent - FastAPI version for easy testing
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from typing import Any, Dict, Optional

app = FastAPI(title="Regulatory Compliance Agent")

# Base URL for the TypeScript service
SERVICE_BASE_URL = "http://localhost:3001/api"

class AnalyzeRequest(BaseModel):
    organization_id: str = "org-demo-bank-001"
    action: str = "analyze"

class AgentResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    action: str

@app.post("/analyze", response_model=AgentResponse)
async def analyze_compliance(request: AnalyzeRequest):
    """
    Perform complete DORA compliance analysis for an organization.
    Returns policies and alerts in CompliQuest MCP format.
    """
    try:
        response = requests.post(
            f"{SERVICE_BASE_URL}/analyze",
            json={
                "organizationId": request.organization_id,
                "frameworkId": "dora-2022"
            },
            timeout=30
        )
        response.raise_for_status()
        return AgentResponse(
            success=True,
            data=response.json(),
            action="analyze"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze compliance: {str(e)}")

@app.get("/questions/{organization_id}")
async def get_questions(organization_id: str = "org-demo-bank-001"):
    """Get CompliQuest-compatible compliance questions"""
    try:
        response = requests.get(
            f"{SERVICE_BASE_URL}/questions/compliquest/{organization_id}",
            params={"refresh": "true"},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get questions: {str(e)}")

@app.get("/gaps/{organization_id}")
async def get_gaps(organization_id: str = "org-demo-bank-001"):
    """Get detailed gap analysis"""
    try:
        response = requests.get(
            f"{SERVICE_BASE_URL}/gap-analysis/demo",
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get gap analysis: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "regulatory-compliance-agent"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
