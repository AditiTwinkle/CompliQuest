import dynamodb, { TABLES } from '../services/dynamodb';
import { Notification } from '../models/Notification';
import logger from '../utils/logger';

export const NOTIFICATIONS_TABLE = 'compliquest-notifications';

export class NotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    try {
      await dynamodb
        .put({
          TableName: NOTIFICATIONS_TABLE,
          Item: notification,
        })
        .promise();
      logger.info(`Notification created: ${notification.id}`);
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  async findById(notificationId: string): Promise<Notification | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: NOTIFICATIONS_TABLE,
          Key: { id: notificationId },
        })
        .promise();
      return (result.Item as Notification) || null;
    } catch (error) {
      logger.error('Failed to find notification by ID:', error);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Notification[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: NOTIFICATIONS_TABLE,
          IndexName: 'userId-createdAt-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
          ScanIndexForward: false, // Sort by createdAt descending
        })
        .promise();
      return (result.Items as Notification[]) || [];
    } catch (error) {
      logger.error('Failed to find notifications by user:', error);
      throw error;
    }
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: NOTIFICATIONS_TABLE,
          IndexName: 'userId-createdAt-index',
          KeyConditionExpression: 'userId = :userId',
          FilterExpression: '#read = :read',
          ExpressionAttributeNames: {
            '#read': 'read',
          },
          ExpressionAttributeValues: {
            ':userId': userId,
            ':read': false,
          },
          ScanIndexForward: false,
        })
        .promise();
      return (result.Items as Notification[]) || [];
    } catch (error) {
      logger.error('Failed to find unread notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const result = await dynamodb
        .update({
          TableName: NOTIFICATIONS_TABLE,
          Key: { id: notificationId },
          UpdateExpression: 'SET #read = :read, readAt = :readAt',
          ExpressionAttributeNames: {
            '#read': 'read',
          },
          ExpressionAttributeValues: {
            ':read': true,
            ':readAt': Date.now(),
          },
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      logger.info(`Notification marked as read: ${notificationId}`);
      return result.Attributes as Notification;
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  async delete(notificationId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: NOTIFICATIONS_TABLE,
          Key: { id: notificationId },
        })
        .promise();
      logger.info(`Notification deleted: ${notificationId}`);
    } catch (error) {
      logger.error('Failed to delete notification:', error);
      throw error;
    }
  }
}

export default new NotificationRepository();
