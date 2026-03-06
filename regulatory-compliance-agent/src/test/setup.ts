// Jest setup file for regulatory compliance agent tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.LOG_LEVEL = 'error';
process.env.AWS_REGION = 'us-east-1';
process.env.BEDROCK_REGION = 'us-east-1';
process.env.BEDROCK_MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

// Mock AWS SDK to avoid actual AWS calls during tests
jest.mock('@aws-sdk/client-bedrock-runtime', () => ({
  BedrockRuntimeClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  InvokeModelCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-bedrock', () => ({
  BedrockClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
}));

// Increase timeout for integration tests
jest.setTimeout(30000);