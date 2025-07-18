import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetPresignedUrlInput } from './input/get-presigned-url.input';
import { GetPresignedUrlResponseDto } from './dto/get-presigned-url-response.dto';
import s3Config from './config/s3.config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    @Inject(s3Config.KEY)
    private readonly s3TypedConfig: ConfigType<typeof s3Config>,
  ) {
    const region = this.s3TypedConfig.region;
    const bucketName = this.s3TypedConfig.bucketName;

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
