import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION,
}));
