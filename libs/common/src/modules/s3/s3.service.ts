import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { GetPresignedUrlInput } from './input/get-presigned-url.input';
import { PresignedUrlModel } from './model/presigned-url.model';
import { v4 as uuidv4 } from 'uuid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { GetPresignedUrlsInput } from './input/get-presigned-urls.input';

/**
 * S3 서비스
 *
 * @publicApi
 */
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
   * S3 업로드 위한 Presigned URL 단일 생성
   *
   * @author 조희주
   */
  async getPresignedUrl(
    getPresignedUrl: GetPresignedUrlInput,
  ): Promise<PresignedUrlModel> {
    const { folder, extension, maxSize, contentType } = getPresignedUrl;

    const key = `${folder}/${uuidv4()}.${extension}`;

    return await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: key,
      Expires: 5 * 60,
      Conditions: [
        ['content-length-range', 0, maxSize * 1024 * 1024],
        ['starts-with', '$Content-Type', contentType],
      ],
    });
  }

  /**
   * S3 업로드 위한 Presigned URL 여러개 생성
   *
   * @author 조희주
   */
  async getPresignedUrls(
    getPresignedUrlsInput: GetPresignedUrlsInput,
  ): Promise<PresignedUrlModel[]> {
    const { folder, extensions, maxSize, contentType } = getPresignedUrlsInput;

    const presignedPostList = await Promise.all(
      extensions.map(async (extension) => {
        const key = `${folder}/${uuidv4()}.${extension}`;

        return createPresignedPost(this.s3Client, {
          Bucket: this.bucketName,
          Key: key,
          Expires: 5 * 60,
          Conditions: [
            ['content-length-range', 0, maxSize * 1024 * 1024],
            ['starts-with', '$Content-Type', contentType],
          ],
        });
      }),
    );

    return presignedPostList;
  }
}
