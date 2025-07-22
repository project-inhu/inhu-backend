import { Body, Controller, Post } from '@nestjs/common';
import { S3UploadService } from './s3-upload.service';
import { S3_FOLDER } from '@libs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { GetPresignedUrlDto } from './dto/request/get-presigned-url.dto';
import { PresignedUrlEntity } from './entity/presigned-url.entity';
@Controller('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('/profile-image/presigned-url')
  @LoginAuth()
  async CreateProfileImagePresignedUrl(
    @Body() getPresignedUrlDto: GetPresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.CreateProfileImagePresignedUrl({
      folder: S3_FOLDER.PROFILE,
      filename: getPresignedUrlDto.filename,
    });
  }
}
