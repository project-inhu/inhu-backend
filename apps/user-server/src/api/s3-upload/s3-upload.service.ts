import { PresignedUrlModel, S3Service } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { GetPresignedUrlDto } from './dto/request/get-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async CreateProfileImagePresignedUrl(
    getPresignedUrlDto: GetPresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return this.s3Service.getPresignedUrl(getPresignedUrlDto);
  }
}
