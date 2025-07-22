import { Controller, Get, Query } from '@nestjs/common';
import { S3UploadService } from './s3-upload.service';
import { PresignedUrlEntity } from './entity/pregiend-url.entity';
import { S3_FOLDER } from '@libs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
@Controller('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Get('/profile-image/presigned-url')
  @LoginAuth()
  async getProfileImagePresignedUrl(
    @Query('filename') filename: string,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.getProfileImagePresignedUrl({
      folder: S3_FOLDER.PROFILE,
      filename: filename,
    });
  }
}
