import dynamodb, { TABLES } from '../services/dynamodb';
import { ComplianceProject } from '../models/ComplianceProject';
import logger from '../utils/logger';

export class ProjectRepository {
  async create(project: ComplianceProject): Promise<ComplianceProject> {
    try {
      await dynamodb
        .put({
          TableName: TABLES.PROJECTS,
          Item: project,
        })
        .promise();
      logger.info(`Project created: ${project.id}`);
      return project;
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  async findById(projectId: string): Promise<ComplianceProject | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLES.PROJECTS,
          Key: { id: projectId },
        })
        .promise();
      return (result.Item as ComplianceProject) || null;
    } catch (error) {
      logger.error('Failed to find project by ID:', error);
      throw error;
    }
  }

  async findByOrganization(organizationId: string): Promise<ComplianceProject[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: TABLES.PROJECTS,
          IndexName: 'organizationId-index',
          KeyConditionExpression: 'organizationId = :orgId',
          ExpressionAttributeValues: {
            ':orgId': organizationId,
          },
        })
        .promise();
      return (result.Items as ComplianceProject[]) || [];
    } catch (error) {
      logger.error('Failed to find projects by organization:', error);
      throw error;
    }
  }

  async update(projectId: string, updates: Partial<ComplianceProject>): Promise<ComplianceProject> {
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
          TableName: TABLES.PROJECTS,
          Key: { id: projectId },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      logger.info(`Project updated: ${projectId}`);
      return result.Attributes as ComplianceProject;
    } catch (error) {
      logger.error('Failed to update project:', error);
      throw error;
    }
  }

  async delete(projectId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: TABLES.PROJECTS,
          Key: { id: projectId },
        })
        .promise();
      logger.info(`Project deleted: ${projectId}`);
    } catch (error) {
      logger.error('Failed to delete project:', error);
      throw error;
    }
  }

  calculateComplianceScore(project: ComplianceProject): number {
    if (project.totalControls === 0) return 0;
    return Math.round((project.compliantControls / project.totalControls) * 100);
  }
}

export default new ProjectRepository();
