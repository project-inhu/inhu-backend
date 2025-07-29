import { PresignedUrlModel, S3_FOLDER, S3Service } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createProfileImagePresignedUrl(
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.PROFILE,
      extension: createProfileImagePresignedUrlDto.extension,
    });
  }
}
