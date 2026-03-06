import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { BedrockConfig } from '../config/bedrock';

describe('Integration Tests', () => {
  describe('Configuration', () => {
    it('should load environment configuration correctly', () => {
      expect(config.port).toBe(3001);
      expect(config.nodeEnv).toBe('test'); // Set in test setup
      expect(config.aws.region).toBe('us-east-1');
      expect(config.bedrock.modelId).toContain('claude');
    });
  });

  describe('Logger', () => {
    it('should create logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
    });

    it('should log messages without errors', () => {
      expect(() => {
        logger.info('Test log message');
      }).not.toThrow();
    });
  });

  describe('Bedrock Configuration', () => {
    it('should initialize Bedrock clients', () => {
      const runtimeClient = BedrockConfig.getRuntimeClient();
      const client = BedrockConfig.getClient();
      
      expect(runtimeClient).toBeDefined();
      expect(client).toBeDefined();
    });

    it('should return correct model ID', () => {
      const modelId = BedrockConfig.getModelId();
      expect(modelId).toContain('claude');
    });
  });
});