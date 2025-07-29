import { Body, Controller, Post } from '@nestjs/common';
import { S3UploadService } from './s3-upload.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { PresignedUrlEntity } from './entity/presigned-url.entity';
@Controller('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('/profile-image/presigned-url')
  @LoginAuth()
  async CreateProfileImagePresignedUrl(
    @Body()
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.CreateProfileImagePresignedUrl(
      createProfileImagePresignedUrlDto,
    );
  }
}
