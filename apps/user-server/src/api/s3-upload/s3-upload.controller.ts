import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { S3UploadService } from './s3-upload.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { PresignedUrlEntity } from './entity/presigned-url.entity';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Exception } from '@libs/common/decorator/exception.decorator';
@Controller('s3-upload')
@ApiTags('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('/profile-image/presigned-url')
  @HttpCode(201)
  @Exception(401, 'no accessToken')
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @LoginAuth()
  async createProfileImagePresignedUrl(
    @Body()
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createProfileImagePresignedUrl(
      createProfileImagePresignedUrlDto,
    );
  }
}
