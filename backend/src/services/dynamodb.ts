import AWS from 'aws-sdk';
import logger from '../utils/logger';

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const TABLES = {
  USERS: process.env.USERS_TABLE || 'compliquest-users',
  ORGANIZATIONS: process.env.ORGANIZATIONS_TABLE || 'compliquest-organizations',
  PROJECTS: process.env.PROJECTS_TABLE || 'compliquest-projects',
  CONTROLS: process.env.CONTROLS_TABLE || 'compliquest-controls',
  FRAMEWORKS: process.env.FRAMEWORKS_TABLE || 'compliquest-frameworks',
  ACHIEVEMENTS: process.env.ACHIEVEMENTS_TABLE || 'compliquest-achievements',
  ALERTS: process.env.ALERTS_TABLE || 'compliquest-alerts',
};

export async function initializeTables() {
  try {
    logger.info('DynamoDB tables initialized');
  } catch (error) {
    logger.error('Failed to initialize DynamoDB tables:', error);
    throw error;
  }
}

export { dynamodb };
export default dynamodb;
