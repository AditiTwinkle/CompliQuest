import { dynamodb } from '../services/dynamodb';
import {
  ComplianceControlResponse,
  ControlResponseCreateInput,
  ControlResponseUpdateInput,
  ControlResponseDTO,
} from '../models/ComplianceControlResponse';

const TABLE_NAME = 'ComplianceControlResponses';

export class ComplianceControlResponseRepository {
  async create(input: ControlResponseCreateInput): Promise<ComplianceControlResponse> {
    const id = `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const response: ComplianceControlResponse = {
      id,
      projectId: input.projectId,
      controlId: input.controlId,
      frameworkId: input.frameworkId,
      userResponse: input.userResponse,
      status: 'not_started',
      evidenceIds: input.evidenceIds || [],
      validationErrors: [],
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: response,
    };

    await dynamodb.put(params).promise();
    return response;
  }

  async getById(id: string): Promise<ComplianceControlResponse | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };

    const result = await dynamodb.get(params).promise();
    return result.Item as ComplianceControlResponse | null;
  }

  async getByProjectAndControl(
    projectId: string,
    controlId: string
  ): Promise<ComplianceControlResponse | null> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'projectId-controlId-index',
      KeyConditionExpression: 'projectId = :projectId AND controlId = :controlId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':controlId': controlId,
      },
    };

    const result = await dynamodb.query(params).promise();
    return result.Items?.[0] as ComplianceControlResponse | null;
  }

  async getByProject(projectId: string): Promise<ComplianceControlResponse[]> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'projectId-index',
      KeyConditionExpression: 'projectId = :projectId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
      },
    };

    const result = await dynamodb.query(params).promise();
    return (result.Items as ComplianceControlResponse[]) || [];
  }

  async update(id: string, input: ControlResponseUpdateInput): Promise<ComplianceControlResponse> {
    const now = Date.now();
    const updateExpressions: string[] = ['updatedAt = :updatedAt'];
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': now,
    };

    if (input.userResponse !== undefined) {
      updateExpressions.push('userResponse = :userResponse');
      expressionAttributeValues[':userResponse'] = input.userResponse;
    }

    if (input.status !== undefined) {
      updateExpressions.push('#status = :status');
      expressionAttributeValues[':status'] = input.status;
    }

    if (input.evidenceIds !== undefined) {
      updateExpressions.push('evidenceIds = :evidenceIds');
      expressionAttributeValues[':evidenceIds'] = input.evidenceIds;
    }

    if (input.validationErrors !== undefined) {
      updateExpressions.push('validationErrors = :validationErrors');
      expressionAttributeValues[':validationErrors'] = input.validationErrors;
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpressions.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ReturnValues: 'ALL_NEW' as const,
    };

    const result = await dynamodb.update(params).promise();
    return result.Attributes as ComplianceControlResponse;
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };

    await dynamodb.delete(params).promise();
  }

  async getByStatus(projectId: string, status: string): Promise<ComplianceControlResponse[]> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'projectId-status-index',
      KeyConditionExpression: 'projectId = :projectId AND #status = :status',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    };

    const result = await dynamodb.query(params).promise();
    return (result.Items as ComplianceControlResponse[]) || [];
  }

  async getNextUnansweredControl(projectId: string): Promise<ComplianceControlResponse | null> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'projectId-status-index',
      KeyConditionExpression: 'projectId = :projectId AND #status = :status',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':status': 'not_started',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      Limit: 1,
    };

    const result = await dynamodb.query(params).promise();
    return result.Items?.[0] as ComplianceControlResponse | null;
  }

  toDTO(response: ComplianceControlResponse): ControlResponseDTO {
    return {
      id: response.id,
      projectId: response.projectId,
      controlId: response.controlId,
      frameworkId: response.frameworkId,
      userResponse: response.userResponse,
      status: response.status,
      evidenceIds: response.evidenceIds,
      aiGuidance: response.aiGuidance,
      validationErrors: response.validationErrors,
      submittedAt: response.submittedAt,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}
