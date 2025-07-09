import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { S3Folder } from './enums/s3-folder.enum';
import { promises } from 'dns';

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
   * 단일 파일 업로드
   *
   * @author 조희주
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: S3Folder,
  ): Promise<string> {
    return this.upload(file, folder);
  }

  /**
   * 다중 파일 업로드
   *
   * @author 조희주
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: S3Folder,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.upload(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * S3에 파일 업로드
   *
   * @example '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'
   *
   * @author 조희주
   */
  private async upload(
    file: Express.Multer.File,
    folder: S3Folder,
  ): Promise<string> {
    const key = `/${folder}/${uuid()}-${file.originalname}`;

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
