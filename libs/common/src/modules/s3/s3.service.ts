import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { GetPresignedUrlInput } from './input/get-presigned-url.input';
import { PresignedUrlModel } from './model/presigned-url.model';
import { v4 as uuidv4 } from 'uuid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { GetPresignedUrlsInput } from './input/get-presigned-urls.input';
import { HttpService } from '@nestjs/axios';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { UploadedFileModel } from '@libs/common/modules/s3/model/uploaded-file.model';

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
  private readonly fileHost: string;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const region = configService.get<string>('s3.region');
    const bucketName = configService.get<string>('s3.bucketName');
    const fileHost = configService.get<string>('s3.fileHost') || '';

    if (!region || !bucketName) {
      throw new Error('S3 environment variables are not configured.');
    }

    this.region = region;
    this.bucketName = bucketName;
    this.fileHost = fileHost;

    this.s3Client = new S3Client({
      region: this.region,
    });
  }

  /**
   * S3 업로드 위한 Presigned URL 단일 생성
   *
   * @author 조희주
   */
  async getPresignedUrl({
    folder,
    extension,
    maxSize,
    contentType,
  }: GetPresignedUrlInput): Promise<PresignedUrlModel> {
    const key = `${folder}/${uuidv4()}.${extension}`;

    const result = await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: key,
      Expires: 5 * 60,
      Conditions: [
        ['eq', '$acl', 'public-read'],
        ['content-length-range', 0, maxSize * 1024 * 1024],
        ['starts-with', '$Content-Type', contentType],
      ],
    });

    return {
      ...result,
      fileHost: this.fileHost,
      filePath: `/${key}`,
    };
  }

  /**
   * S3 업로드 위한 Presigned URL 여러개 생성
   *
   * @author 조희주
   */
  async getPresignedUrls({
    folder,
    extensions,
    maxSize,
    contentType,
  }: GetPresignedUrlsInput): Promise<PresignedUrlModel[]> {
    return await Promise.all(
      extensions.map((extension) =>
        this.getPresignedUrl({ folder, extension, maxSize, contentType }),
      ),
    );
  }

  public async uploadImageFromUrl(
    options: { path: S3Folder; name: string },
    url: string,
  ) {
    const response = await this.httpService.axiosRef.get(url, {
      responseType: 'stream',
    });

    // const contentType: string = response.headers['content-type'] || '';

    // if (!contentType.includes('image') && !url.endsWith('jfif')) {
    //   throw new Error('fail to download image | url = ' + url);
    // }

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: `${options.path}/${options.name}`,
        Body: response.data,
        ACL: 'public-read',
      },
    });

    const result = await upload.done();

    return new UploadedFileModel({
      url: result.Location || '',
      name: options.name,
      ext: this.extractFileExt(options.name),
      path: `/${result.Key}`,
    });
  }

  /**
   * 파일 확장자명 추출하기
   */
  private extractFileExt(fileName: string): string {
    return fileName.split('.')[fileName.split('.').length - 1];
  }
}
