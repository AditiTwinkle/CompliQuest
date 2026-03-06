#!/usr/bin/env python3
"""
Test strands API
"""

import strands

print("Strands module contents:")
for item in dir(strands):
    if not item.startswith('_'):
        print(f"  {item}")

print("\nChecking tool module:")
import strands.tool as tool_module
print(f"  tool module: {tool_module}")

print("\nChecking if agent has tool attribute:")
from strands import Agent
agent = Agent(name="Test", description="Test agent", model="anthropic.claude-3-5-sonnet-20241022")
print(f"  agent.tool type: {type(agent.tool)}")
print(f"  agent.tool: {agent.tool}")

# Try to see what methods are available
print("\nMethods available on agent.tool:")
for attr in dir(agent.tool):
    if not attr.startswith('_'):
        print(f"  {attr}")