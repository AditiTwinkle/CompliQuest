"""Test script for the regulatory compliance agent"""
import requests
import json

# Test the agent endpoint
def test_agent():
    url = "http://localhost:8001/invoke"
    payload = {
        "action": "analyze",
        "organization_id": "org-demo-bank-001"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_agent()
