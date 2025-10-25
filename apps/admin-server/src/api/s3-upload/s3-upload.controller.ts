import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { S3UploadService } from '@admin/api/s3-upload/s3-upload.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { CreateBannerImagePresignedUrlDto } from '@admin/api/s3-upload/dto/request/create-banner-image-presigned-url.dto';
import { PresignedUrlEntity } from '@admin/api/s3-upload/entity/presigned-url.entity';
import { CreatePlaceImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-place-image-presigned-url.dto';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { CreateMagazineImagePresignedUrlsDto } from './dto/request/create-magazine-imgae-presigned-url.dto';

@Controller('s3-upload')
@ApiTags('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('/banner-image/presigned-url')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @AdminAuth()
  async createBannerImagePresignedUrl(
    @Body() createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createBannerImagePresignedUrl(
      createBannerImagePresignedUrlDto,
    );
  }

  @Post('/menu-image/presigned-url')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @AdminAuth()
  async createMenuImagePresignedUrl(
    @Body() createMenuImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createMenuImagePresignedUrl(
      createMenuImagePresignedUrlDto,
    );
  }

  @Post('/place-image/presigned-urls')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n' +
      '- extensions array is empty\n' +
      '- extensions array contains an invalid extension\n' +
      '- extensions array exceeds max size',
  })
  @AdminAuth()
  async createPlaceImagePresignedUrls(
    @Body() createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createPlaceImagePresignedUrls(
      createPlaceImagePresignedUrlsDto,
    );
  }

  @Post('/magazine-image/presigned-urls')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n' +
      '- extensions array is empty\n' +
      '- extensions array contains an invalid extension\n' +
      '- extensions array exceeds max size',
  })
  @AdminAuth()
  async createMagazineImagePresignedUrls(
    @Body()
    createMagazineImagePresignedUrlsDto: CreateMagazineImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createMagazineImagePresignedUrls(
      createMagazineImagePresignedUrlsDto,
    );
  }
}
