#!/usr/bin/env python3
"""
Simple test script for CompliQuest agent
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Try to import without strands first
try:
    from main import app, SYSTEM_PROMPT
    print("✓ Successfully imported agent app")
    print(f"✓ System prompt loaded ({len(SYSTEM_PROMPT)} characters)")
    
    # Test the tools directly
    from main import get_compliance_framework, get_project_controls, evaluate_response
    
    print("\nTesting compliance framework tool:")
    result = get_compliance_framework("gdpr")
    print(f"  GDPR framework: {result}")
    
    print("\nTesting project controls tool:")
    result = get_project_controls("proj-1")
    print(f"  Project controls: {result.get('project_name', 'Unknown')}")
    
    print("\nTesting response evaluation tool:")
    result = evaluate_response("ctrl-1", "We obtain explicit consent through a checkbox system")
    print(f"  Response evaluation: {result.get('status', 'Unknown')} with score {result.get('score', 0)}")
    
    print("\n✓ All basic tests passed!")
    
except ImportError as e:
    print(f"✗ Import error: {e}")
    print("\nTrying to check dependencies...")
    
    # Check what's missing
    try:
        import bedrock_agentcore
        print("✓ bedrock_agentcore is available")
    except ImportError:
        print("✗ bedrock_agentcore is missing")
        
    try:
        import strands
        print("✓ strands is available")
    except ImportError:
        print("✗ strands is missing - this is required for the agent")
        
    print("\nTo install strands, you might need to:")
    print("1. Install CMake and C++ compiler for Windows")
    print("2. Or use WSL/Linux environment")
    print("3. Or contact the strands maintainers for Windows support")

except Exception as e:
    print(f"✗ Error during testing: {e}")
    import traceback
    traceback.print_exc()