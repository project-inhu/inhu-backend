import { PresignedUrlModel, S3Service } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { CreatePresignedUrlDto } from './dto/request/create-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async CreateProfileImagePresignedUrl(
    createPresignedUrlDto: CreatePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return this.s3Service.getPresignedUrl(createPresignedUrlDto);
  }
}
