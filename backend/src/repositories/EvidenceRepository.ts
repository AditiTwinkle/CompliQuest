import dynamodb, { TABLES } from '../services/dynamodb';
import { Evidence } from '../models/Evidence';
import logger from '../utils/logger';

export const EVIDENCE_TABLE = 'compliquest-evidence';

export class EvidenceRepository {
  async create(evidence: Evidence): Promise<Evidence> {
    try {
      await dynamodb
        .put({
          TableName: EVIDENCE_TABLE,
          Item: evidence,
        })
        .promise();
      logger.info(`Evidence created: ${evidence.id}`);
      return evidence;
    } catch (error) {
      logger.error('Failed to create evidence:', error);
      throw error;
    }
  }

  async findById(evidenceId: string): Promise<Evidence | null> {
    try {
      const result = await dynamodb
        .get({
          TableName: EVIDENCE_TABLE,
          Key: { id: evidenceId },
        })
        .promise();
      return (result.Item as Evidence) || null;
    } catch (error) {
      logger.error('Failed to find evidence by ID:', error);
      throw error;
    }
  }

  async findByControl(controlId: string): Promise<Evidence[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: EVIDENCE_TABLE,
          IndexName: 'controlId-index',
          KeyConditionExpression: 'controlId = :controlId',
          ExpressionAttributeValues: {
            ':controlId': controlId,
          },
        })
        .promise();
      return (result.Items as Evidence[]) || [];
    } catch (error) {
      logger.error('Failed to find evidence by control:', error);
      throw error;
    }
  }

  async findByProject(projectId: string): Promise<Evidence[]> {
    try {
      const result = await dynamodb
        .query({
          TableName: EVIDENCE_TABLE,
          IndexName: 'projectId-index',
          KeyConditionExpression: 'projectId = :projectId',
          ExpressionAttributeValues: {
            ':projectId': projectId,
          },
        })
        .promise();
      return (result.Items as Evidence[]) || [];
    } catch (error) {
      logger.error('Failed to find evidence by project:', error);
      throw error;
    }
  }

  async delete(evidenceId: string): Promise<void> {
    try {
      await dynamodb
        .delete({
          TableName: EVIDENCE_TABLE,
          Key: { id: evidenceId },
        })
        .promise();
      logger.info(`Evidence deleted: ${evidenceId}`);
    } catch (error) {
      logger.error('Failed to delete evidence:', error);
      throw error;
    }
  }
}

export default new EvidenceRepository();
