import * as cdk from 'aws-cdk-lib';
import { CompliQuestStack } from './stacks/compliquest-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';

new CompliQuestStack(app, `CompliQuest-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  environment,
});

app.synth();
