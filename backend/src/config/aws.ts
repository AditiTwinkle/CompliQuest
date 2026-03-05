import AWS from 'aws-sdk';

// Validate region parameter to prevent injection attacks
const region = process.env.AWS_REGION || 'us-east-1';
const validRegions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1'
];

if (!validRegions.includes(region)) {
  console.warn(`Warning: AWS region "${region}" is not in the validated list. Using us-east-1 instead.`);
}

AWS.config.update({
  region: validRegions.includes(region) ? region : 'us-east-1',
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();
export const s3 = new AWS.S3();
export const cognito = new AWS.CognitoIdentityServiceProvider();
export const bedrock = new AWS.BedrockRuntime();

export default AWS;
