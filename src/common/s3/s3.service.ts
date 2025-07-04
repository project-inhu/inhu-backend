import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get('AWS_REGION');
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');

    if (!region || !bucketName) {
      throw new InternalServerErrorException(
        'S3 environment variables are not configured.',
      );
    }

    this.region = region;
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: this.region,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${uuid()}${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return key;
  }
}
