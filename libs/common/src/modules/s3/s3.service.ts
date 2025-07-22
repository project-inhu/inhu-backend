import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetPresignedUrlInput } from './input/get-presigned-url.input';
import { PresignedUrlModel } from './model/presigned-url.model';
import s3Config from './config/s3.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(configService: ConfigService) {
    const region = configService.get<string>('s3.region');
    const bucketName = configService.get<string>('s3.bucketName');

    if (!region || !bucketName) {
      throw new Error('S3 environment variables are not configured.');
    }

    this.region = region;
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: this.region,
    });
  }

  /**
   * S3 업로드 위한 Presigned URL 생성
   *
   * @author 조희주
   */
  async getPresignedUrl(
    getPresignedUrl: GetPresignedUrlInput,
  ): Promise<PresignedUrlModel> {
    const { folder, filename } = getPresignedUrl;

    const key = `/${folder}/${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 5 * 60,
    });

    return {
      presignedUrl,
      key,
    };
  }
}
