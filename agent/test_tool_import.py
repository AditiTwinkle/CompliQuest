#!/usr/bin/env python3
"""
Test what 'tool' is when imported from strands
"""

from strands import tool

print(f"tool type: {type(tool)}")
print(f"tool: {tool}")

# Check if it's a decorator
try:
    @tool
    def test_function():
        return "test"
    print("✓ 'tool' is a decorator")
    print(f"  Decorated function: {test_function()}")
except Exception as e:
    print(f"✗ 'tool' is not a decorator: {e}")

# Check what attributes it has
print("\nAttributes of 'tool':")
for attr in dir(tool):
    if not attr.startswith('_'):
        print(f"  {attr}")