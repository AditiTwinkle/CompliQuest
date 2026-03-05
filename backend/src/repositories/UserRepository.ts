import dynamodb, { TABLES } from '../services/dynamodb';
import { User, UserCreateInput } from '../models/User';
import logger from '../utils/logger';

export class UserRepository {
  async create(user: User): Promise<User> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.USERS,
          Item: user,
        })
        .promise();
      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async findById(userId: string): Promise<User | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.USERS,
          Key: { id: userId },
        })
        .promise();
      return result.Item as User | undefined || null;
    } catch (error) {
      logger.error('Failed to find user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.USERS,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email,
          },
        })
        .promise();
      return (result.Items?.[0] as User) || null;
    } catch (error) {
      logger.error('Failed to find user by email:', error);
      throw error;
    }
  }

  async update(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const updateExpression = Object.keys(updates)
        .map((key) => `${key} = :${key}`)
        .join(', ');

      const expressionAttributeValues: any = {};
      Object.entries(updates).forEach(([key, value]) => {
        expressionAttributeValues[`:${key}`] = value;
      });

      const result = await dynamodb
        .update({
          TableName: TABLES.USERS,
          Key: { id: userId },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      logger.info(`User updated: ${userId}`);
      return result.Attributes as User;
    } catch (error) {
      logger.error('Failed to update user:', error);
      throw error;
    }
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.USERS,
          IndexName: 'organizationId-index',
          KeyConditionExpression: 'organizationId = :orgId',
          ExpressionAttributeValues: {
            ':orgId': organizationId,
          },
        })
        .promise();
      return (result.Items as User[]) || [];
    } catch (error) {
      logger.error('Failed to find users by organization:', error);
      throw error;
    }
  }
}

export default new UserRepository();
