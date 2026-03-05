import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface CompliQuestStackProps extends cdk.StackProps {
  environment: string;
}

export class CompliQuestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CompliQuestStackProps) {
    super(scope, id, props);

    const environment = props.environment;

    // ==================== Cognito ====================
    const userPool = new cognito.UserPool(this, 'CompliQuestUserPool', {
      userPoolName: `compliquest-${environment}`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient('CompliQuestClient', {
      clientName: `compliquest-${environment}`,
      generateSecret: true,
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
        custom: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
      },
    });

    // ==================== DynamoDB Tables ====================
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `compliquest-users-${environment}`,
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    usersTable.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const organizationsTable = new dynamodb.Table(this, 'OrganizationsTable', {
      tableName: `compliquest-organizations-${environment}`,
      partitionKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
      tableName: `compliquest-projects-${environment}`,
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    projectsTable.addGlobalSecondaryIndex({
      indexName: 'organizationId-status-index',
      partitionKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const controlsTable = new dynamodb.Table(this, 'ControlsTable', {
      tableName: `compliquest-controls-${environment}`,
      partitionKey: { name: 'controlId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    controlsTable.addGlobalSecondaryIndex({
      indexName: 'projectId-status-index',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const achievementsTable = new dynamodb.Table(this, 'AchievementsTable', {
      tableName: `compliquest-achievements-${environment}`,
      partitionKey: { name: 'achievementId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    achievementsTable.addGlobalSecondaryIndex({
      indexName: 'userId-earnedAt-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'earnedAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const alertsTable = new dynamodb.Table(this, 'AlertsTable', {
      tableName: `compliquest-alerts-${environment}`,
      partitionKey: { name: 'alertId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    alertsTable.addGlobalSecondaryIndex({
      indexName: 'organizationId-status-index',
      partitionKey: { name: 'organizationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ==================== S3 Buckets ====================
    const assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: `compliquest-assets-${environment}-${cdk.Stack.of(this).account}`,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const evidenceBucket = new s3.Bucket(this, 'EvidenceBucket', {
      bucketName: `compliquest-evidence-${environment}-${cdk.Stack.of(this).account}`,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ==================== API Gateway ====================
    const api = new apigateway.RestApi(this, 'CompliQuestAPI', {
      restApiName: `compliquest-api-${environment}`,
      description: 'CompliQuest API',
      deployOptions: {
        stageName: environment,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    // ==================== CloudWatch ====================
    const logGroup = new logs.LogGroup(this, 'CompliQuestLogGroup', {
      logGroupName: `/aws/compliquest/${environment}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ==================== IAM Roles ====================
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant DynamoDB access
    usersTable.grantReadWriteData(lambdaExecutionRole);
    organizationsTable.grantReadWriteData(lambdaExecutionRole);
    projectsTable.grantReadWriteData(lambdaExecutionRole);
    controlsTable.grantReadWriteData(lambdaExecutionRole);
    achievementsTable.grantReadWriteData(lambdaExecutionRole);
    alertsTable.grantReadWriteData(lambdaExecutionRole);

    // Grant S3 access
    assetsBucket.grantReadWrite(lambdaExecutionRole);
    evidenceBucket.grantReadWrite(lambdaExecutionRole);

    // Grant Bedrock access
    lambdaExecutionRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel', 'bedrock:InvokeAgent'],
        resources: ['arn:aws:bedrock:*::foundation-model/*'],
      })
    );

    // ==================== Outputs ====================
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      exportName: `CompliQuest-UserPoolId-${environment}`,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: `CompliQuest-UserPoolClientId-${environment}`,
    });

    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      exportName: `CompliQuest-APIEndpoint-${environment}`,
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      exportName: `CompliQuest-UsersTable-${environment}`,
    });

    new cdk.CfnOutput(this, 'ProjectsTableName', {
      value: projectsTable.tableName,
      exportName: `CompliQuest-ProjectsTable-${environment}`,
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: assetsBucket.bucketName,
      exportName: `CompliQuest-AssetsBucket-${environment}`,
    });

    new cdk.CfnOutput(this, 'EvidenceBucketName', {
      value: evidenceBucket.bucketName,
      exportName: `CompliQuest-EvidenceBucket-${environment}`,
    });
  }
}
