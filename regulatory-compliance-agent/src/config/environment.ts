import dotenv from 'dotenv';

dotenv.config();

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  aws: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  bedrock: {
    modelId: string;
    region: string;
  };
  logging: {
    level: string;
    filePath: string;
  };
  scraping: {
    rateLimitMs: number;
    maxRetryAttempts: number;
    retryBackoffMs: number;
  };
  dora: {
    baseUrl: string;
  };
}

export const config: EnvironmentConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  bedrock: {
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    region: process.env.BEDROCK_REGION || 'us-east-1',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs/app.log',
  },
  scraping: {
    rateLimitMs: parseInt(process.env.SCRAPING_RATE_LIMIT_MS || '2000', 10),
    maxRetryAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3', 10),
    retryBackoffMs: parseInt(process.env.RETRY_BACKOFF_MS || '1000', 10),
  },
  dora: {
    baseUrl: process.env.DORA_BASE_URL || 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554',
  },
};

export default config;