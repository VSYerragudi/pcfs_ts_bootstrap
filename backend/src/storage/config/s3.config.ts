import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const createS3Client = (configService: ConfigService): S3Client => {
  const host = configService.get<string>('SEAWEEDFS_HOST', 'localhost');
  const port = configService.get<number>('SEAWEEDFS_S3_PORT', 8333);

  return new S3Client({
    endpoint: `http://${host}:${port}`,
    region: 'us-east-1', // SeaweedFS requires a region but doesn't use it
    credentials: {
      accessKeyId: configService.get<string>('SEAWEEDFS_ACCESS_KEY', ''),
      secretAccessKey: configService.get<string>('SEAWEEDFS_SECRET_KEY', ''),
    },
    forcePathStyle: true, // Required for SeaweedFS S3 compatibility
  });
};

export const S3_CLIENT = 'S3_CLIENT';
export const DEFAULT_BUCKET = 'files';
