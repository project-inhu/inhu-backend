import { Body, Controller, Post } from '@nestjs/common';
import { S3UploadService } from '@admin/api/s3-upload/s3-upload.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { CreateBannerImagePresignedUrlDto } from '@admin/api/s3-upload/dto/request/create-banner-image-presigned-url.dto';
import { PresignedUrlEntity } from '@admin/api/s3-upload/entity/presigned-url.entity';
import { CreatePlaceImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-place-image-presigned-url.dto';

@Controller('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('/banner-image/presigned-url')
  @AdminAuth()
  async createBannerImagePresignedUrl(
    @Body() createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createBannerImagePresignedUrl(
      createBannerImagePresignedUrlDto,
    );
  }

  @Post('/menu-image/presigned-url')
  @AdminAuth()
  async createMenuImagePresignedUrl(
    @Body() createMenuImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createMenuImagePresignedUrl(
      createMenuImagePresignedUrlDto,
    );
  }

  @Post('/place-image/presigned-urls')
  @AdminAuth()
  async createPlaceImagePresignedUrls(
    @Body() createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createPlaceImagePresignedUrls(
      createPlaceImagePresignedUrlsDto,
    );
  }

  @Post('/review-image/presigned-urls')
  @AdminAuth()
  async createReviewImagePresignedUrls(
    @Body() createReviewImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createReviewImagePresignedUrls(
      createReviewImagePresignedUrlsDto,
    );
  }
}
