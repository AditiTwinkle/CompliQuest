import dynamodb, { TABLES } from '../services/dynamodb';
import { Alert } from '../models/Alert';
import logger from '../utils/logger';

export class AlertRepository {
  async create(alert: Alert): Promise<Alert> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.ALERTS,
          Item: alert,
        })
        .promise();
      logger.info(`Alert created: ${alert.id}`);
      return alert;
    } catch (error) {
      logger.error('Failed to create alert:', error);
      throw error;
    }
  }

  async findById(alertId: string): Promise<Alert | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.ALERTS,
          Key: { id: alertId },
        })
        .promise();
      return (result.Item as Alert) || null;
    } catch (error) {
      logger.error('Failed to find alert by ID:', error);
      throw error;
    }
  }

  async findByOrganization(organizationId: string): Promise<Alert[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.ALERTS,
          IndexName: 'organizationId-index',
          KeyConditionExpression: 'organizationId = :orgId',
          ExpressionAttributeValues: {
            ':orgId': organizationId,
          },
        })
        .promise();
      return (result.Items as Alert[]) || [];
    } catch (error) {
      logger.error('Failed to find alerts by organization:', error);
      throw error;
    }
  }

  async findByStatus(organizationId: string, status: string): Promise<Alert[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.ALERTS,
          IndexName: 'organizationId-status-index',
          KeyConditionExpression: 'organizationId = :orgId AND #status = :status',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':orgId': organizationId,
            ':status': status,
          },
        })
        .promise();
      return (result.Items as Alert[]) || [];
    } catch (error) {
      logger.error('Failed to find alerts by status:', error);
      throw error;
    }
  }

  async update(alertId: string, updates: Partial<Alert>): Promise<Alert> {
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
          TableName: TABLES.ALERTS,
          Key: { id: alertId },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      logger.info(`Alert updated: ${alertId}`);
      return result.Attributes as Alert;
    } catch (error) {
      logger.error('Failed to update alert:', error);
      throw error;
    }
  }

  async delete(alertId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: TABLES.ALERTS,
          Key: { id: alertId },
        })
        .promise();
      logger.info(`Alert deleted: ${alertId}`);
    } catch (error) {
      logger.error('Failed to delete alert:', error);
      throw error;
    }
  }
}

export default new AlertRepository();
