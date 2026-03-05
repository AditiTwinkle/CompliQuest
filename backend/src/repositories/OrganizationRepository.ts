import dynamodb, { TABLES } from '../services/dynamodb';
import { Organization } from '../models/Organization';
import logger from '../utils/logger';

export class OrganizationRepository {
  async create(organization: Organization): Promise<Organization> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.ORGANIZATIONS,
          Item: organization,
        })
        .promise();
      logger.info(`Organization created: ${organization.id}`);
      return organization;
    } catch (error) {
      logger.error('Failed to create organization:', error);
      throw error;
    }
  }

  async findById(organizationId: string): Promise<Organization | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.ORGANIZATIONS,
          Key: { id: organizationId },
        })
        .promise();
      return (result.Item as Organization) || null;
    } catch (error) {
      logger.error('Failed to find organization by ID:', error);
      throw error;
    }
  }

  async list(): Promise<Organization[]> {
    try {
      const result = await dynamodb
        .scan({
          TableName: TABLES.ORGANIZATIONS,
        })
        .promise();
      return (result.Items as Organization[]) || [];
    } catch (error) {
      logger.error('Failed to list organizations:', error);
      throw error;
    }
  }

  async update(organizationId: string, updates: Partial<Organization>): Promise<Organization> {
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
          TableName: TABLES.ORGANIZATIONS,
          Key: { id: organizationId },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      logger.info(`Organization updated: ${organizationId}`);
      return result.Attributes as Organization;
    } catch (error) {
      logger.error('Failed to update organization:', error);
      throw error;
    }
  }

  async delete(organizationId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: TABLES.ORGANIZATIONS,
          Key: { id: organizationId },
        })
        .promise();
      logger.info(`Organization deleted: ${organizationId}`);
    } catch (error) {
      logger.error('Failed to delete organization:', error);
      throw error;
    }
  }
}

export default new OrganizationRepository();
