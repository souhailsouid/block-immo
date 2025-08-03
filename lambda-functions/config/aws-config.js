


const AWS_CONFIG = {
  REGION: process.env.AWS_REGION || 'eu-west-3',
  USER_POOL_ID: process.env.USER_POOL_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  DYNAMODB_TABLE: process.env.DYNAMODB_TABLE,
};

// Configuration DynamoDB
const DYNAMODB_CONFIG = {
  region: AWS_CONFIG.REGION,
  tableName: AWS_CONFIG.DYNAMODB_TABLE,
};

// Configuration S3
const S3_CONFIG = {
  region: AWS_CONFIG.REGION,
  bucketName: AWS_CONFIG.S3_BUCKET_NAME,
};

// Configuration Cognito
const COGNITO_CONFIG = {
  region: AWS_CONFIG.REGION,
  userPoolId: AWS_CONFIG.USER_POOL_ID,
  clientId: AWS_CONFIG.CLIENT_ID,
};

// IAM Role Statements pour Serverless
const IAM_ROLE_STATEMENTS = [
  {
    Effect: "Allow",
    Action: [
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"
    ],
    Resource: [
      `arn:aws:dynamodb:${AWS_CONFIG.REGION}:*:table/${AWS_CONFIG.DYNAMODB_TABLE}`
    ]
  },
  {
    Effect: "Allow",
    Action: [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ],
    Resource: [
      `arn:aws:s3:::${AWS_CONFIG.S3_BUCKET_NAME}/*`
    ]
  },
  {
    Effect: "Allow",
    Action: [
      "cognito-idp:AdminGetUser",
      "cognito-idp:AdminInitiateAuth",
      "cognito-idp:AdminRespondToAuthChallenge"
    ],
    Resource: [
      `arn:aws:cognito-idp:${AWS_CONFIG.REGION}:*:userpool/${AWS_CONFIG.USER_POOL_ID}`
    ]
  }
];

module.exports = {
  AWS_CONFIG,
  DYNAMODB_CONFIG,
  S3_CONFIG,
  COGNITO_CONFIG,
  IAM_ROLE_STATEMENTS
}; 