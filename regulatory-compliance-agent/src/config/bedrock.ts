import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { BedrockClient } from '@aws-sdk/client-bedrock';
import { config } from './environment';
import { logger } from '../utils/logger';

export class BedrockConfig {
  private static runtimeClient: BedrockRuntimeClient;
  private static client: BedrockClient;

  static getRuntimeClient(): BedrockRuntimeClient {
    if (!this.runtimeClient) {
      const clientConfig = {
        region: config.bedrock.region,
        ...(config.aws.accessKeyId && config.aws.secretAccessKey && {
          credentials: {
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
          },
        }),
      };

      this.runtimeClient = new BedrockRuntimeClient(clientConfig);
      logger.info('Bedrock Runtime client initialized', { region: config.bedrock.region });
    }
    return this.runtimeClient;
  }

  static getClient(): BedrockClient {
    if (!this.client) {
      const clientConfig = {
        region: config.bedrock.region,
        ...(config.aws.accessKeyId && config.aws.secretAccessKey && {
          credentials: {
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
          },
        }),
      };

      this.client = new BedrockClient(clientConfig);
      logger.info('Bedrock client initialized', { region: config.bedrock.region });
    }
    return this.client;
  }

  static getModelId(): string {
    return config.bedrock.modelId;
  }
}

export default BedrockConfig;