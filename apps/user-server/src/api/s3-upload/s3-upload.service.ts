import { Injectable } from '@nestjs/common';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3_FOLDER } from '@libs/common/modules/s3/constants/s3-folder.constants';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createProfileImagePresignedUrl(
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.PROFILE,
      extension: createProfileImagePresignedUrlDto.extension,
      maxSize: createProfileImagePresignedUrlDto.maxSize,
      contentType: createProfileImagePresignedUrlDto.contentType,
    });
  }
}
