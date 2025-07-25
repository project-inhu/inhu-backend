import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetPresignedUrlInput } from './input/get-presigned-url.input';
import { GetPresignedUrlResponseDto } from './dto/get-presigned-url-response.dto';

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

  /**
   * S3 업로드 위한 Presigned URL 생성
   *
   * @author 조희주
   */
  async getPresignedUrl(
    getPresignedUrl: GetPresignedUrlInput,
  ): Promise<GetPresignedUrlResponseDto> {
    const { folder, filename } = getPresignedUrl;

    if (!filename) {
      throw new BadRequestException('You need file.');
    }

    const key = `/${folder}/${new Date().toString()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return {
      presignedUrl,
      key,
    };
  }
}
