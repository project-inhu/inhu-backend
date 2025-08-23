import { Injectable } from '@nestjs/common';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { ContentType } from '@libs/common/modules/s3/constants/content-type.constants';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createProfileImagePresignedUrl(
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3Folder.PROFILE,
      extension: createProfileImagePresignedUrlDto.extension,
      maxSize: 1,
      contentType: ContentType.IMAGE,
    });
  }
}
