import dynamodb, { TABLES } from '../services/dynamodb';
import { ComplianceFramework, ComplianceControl } from '../models/ComplianceFramework';
import logger from '../utils/logger';

export class FrameworkRepository {
  async createFramework(framework: ComplianceFramework): Promise<ComplianceFramework> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.FRAMEWORKS || 'compliquest-frameworks',
          Item: framework,
        })
        .promise();
      logger.info(`Framework created: ${framework.id}`);
      return framework;
    } catch (error) {
      logger.error('Failed to create framework:', error);
      throw error;
    }
  }

  async getFramework(frameworkId: string): Promise<ComplianceFramework | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.FRAMEWORKS || 'compliquest-frameworks',
          Key: { id: frameworkId },
        })
        .promise();
      return (result.Item as ComplianceFramework) || null;
    } catch (error) {
      logger.error('Failed to get framework:', error);
      throw error;
    }
  }

  async listFrameworks(): Promise<ComplianceFramework[]> {
    try {
      const result = await dynamodb
        .scan({
          TableName: TABLES.FRAMEWORKS || 'compliquest-frameworks',
        })
        .promise();
      return (result.Items as ComplianceFramework[]) || [];
    } catch (error) {
      logger.error('Failed to list frameworks:', error);
      throw error;
    }
  }

  async createControl(control: ComplianceControl): Promise<ComplianceControl> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.CONTROLS,
          Item: control,
        })
        .promise();
      logger.info(`Control created: ${control.id}`);
      return control;
    } catch (error) {
      logger.error('Failed to create control:', error);
      throw error;
    }
  }

  async getControl(controlId: string): Promise<ComplianceControl | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.CONTROLS,
          Key: { id: controlId },
        })
        .promise();
      return (result.Item as ComplianceControl) || null;
    } catch (error) {
      logger.error('Failed to get control:', error);
      throw error;
    }
  }

  async getControlsByFramework(frameworkId: string): Promise<ComplianceControl[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.CONTROLS,
          IndexName: 'frameworkId-index',
          KeyConditionExpression: 'frameworkId = :frameworkId',
          ExpressionAttributeValues: {
            ':frameworkId': frameworkId,
          },
        })
        .promise();
      return (result.Items as ComplianceControl[]) || [];
    } catch (error) {
      logger.error('Failed to get controls by framework:', error);
      throw error;
    }
  }

  async getFrameworkControls(frameworkId: string): Promise<ComplianceControl[]> {
    return this.getControlsByFramework(frameworkId);
  }
}

export default new FrameworkRepository();
