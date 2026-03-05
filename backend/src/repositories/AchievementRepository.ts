import dynamodb, { TABLES } from '../services/dynamodb';
import { Achievement } from '../models/Achievement';
import logger from '../utils/logger';

export class AchievementRepository {
  async create(achievement: Achievement): Promise<Achievement> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.ACHIEVEMENTS,
          Item: achievement,
        })
        .promise();
      logger.info(`Achievement created: ${achievement.id}`);
      return achievement;
    } catch (error) {
      logger.error('Failed to create achievement:', error);
      throw error;
    }
  }

  async findById(achievementId: string): Promise<Achievement | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.ACHIEVEMENTS,
          Key: { id: achievementId },
        })
        .promise();
      return (result.Item as Achievement) || null;
    } catch (error) {
      logger.error('Failed to find achievement by ID:', error);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Achievement[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.ACHIEVEMENTS,
          IndexName: 'userId-earnedAt-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
          ScanIndexForward: false, // Sort by earnedAt descending
        })
        .promise();
      return (result.Items as Achievement[]) || [];
    } catch (error) {
      logger.error('Failed to find achievements by user:', error);
      throw error;
    }
  }

  async findByProject(projectId: string): Promise<Achievement[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.ACHIEVEMENTS,
          IndexName: 'projectId-index',
          KeyConditionExpression: 'projectId = :projectId',
          ExpressionAttributeValues: {
            ':projectId': projectId,
          },
        })
        .promise();
      return (result.Items as Achievement[]) || [];
    } catch (error) {
      logger.error('Failed to find achievements by project:', error);
      throw error;
    }
  }

  async delete(achievementId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: TABLES.ACHIEVEMENTS,
          Key: { id: achievementId },
        })
        .promise();
      logger.info(`Achievement deleted: ${achievementId}`);
    } catch (error) {
      logger.error('Failed to delete achievement:', error);
      throw error;
    }
  }
}

export default new AchievementRepository();
