#!/usr/bin/env python3
"""
Minimal test to understand Strands tool registration
"""

from strands import Agent

# Create agent
agent = Agent(
    name="Test",
    description="Test agent",
    model="anthropic.claude-3-5-sonnet-20241022",
)

print(f"Agent created: {agent.name}")
print(f"Agent.tool type: {type(agent.tool)}")
print(f"Agent.tool: {agent.tool}")

# Try different ways to register tools
print("\nTrying to register tool...")

# Method 1: Try using agent.tool as a decorator
try:
    @agent.tool
    def test_tool():
        return {"test": "ok"}
    print("✓ Method 1 worked: @agent.tool decorator")
except Exception as e:
    print(f"✗ Method 1 failed: {e}")

# Method 2: Try using agent.tool.register()
try:
    def test_tool2():
        return {"test2": "ok"}
    
    if hasattr(agent.tool, 'register'):
        agent.tool.register(test_tool2)
        print("✓ Method 2 worked: agent.tool.register()")
    else:
        print("✗ Method 2: agent.tool has no 'register' method")
except Exception as e:
    print(f"✗ Method 2 failed: {e}")

# Method 3: Check what methods are available
print("\nMethods on agent.tool:")
for attr in dir(agent.tool):
    if not attr.startswith('_'):
        print(f"  {attr}")

# Method 4: Try to see if there's a different way
print("\nChecking agent methods:")
for attr in dir(agent):
    if not attr.startswith('_') and 'tool' in attr.lower():
        print(f"  {attr}: {getattr(agent, attr)}")