import { Injectable } from '@nestjs/common';
import { CreateBannerImagePresignedUrlDto } from './dto/request/create-banner-image-presigned-url.dto';
import { CreateMenuImagePresignedUrlDto } from './dto/request/create-menu-image-presigned-url.dto';
import { CreatePlaceImagePresignedUrlsDto } from './dto/request/create-place-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3_FOLDER } from '@libs/common/modules/s3/constants/s3-folder.constants';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createBannerImagePresignedUrl(
    createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.BANNER,
      extension: createBannerImagePresignedUrlDto.extension,
      maxSize: createBannerImagePresignedUrlDto.maxSize,
      contentType: createBannerImagePresignedUrlDto.contentType,
    });
  }

  public async createMenuImagePresignedUrl(
    createMenuImagePresignedUrlDto: CreateMenuImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.MENU,
      extension: createMenuImagePresignedUrlDto.extension,
      maxSize: createMenuImagePresignedUrlDto.maxSize,
      contentType: createMenuImagePresignedUrlDto.contentType,
    });
  }

  public async createPlaceImagePresignedUrls(
    createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3_FOLDER.PLACE,
      extensions: createPlaceImagePresignedUrlsDto.extensions,
      maxSize: createPlaceImagePresignedUrlsDto.maxSize,
      contentType: createPlaceImagePresignedUrlsDto.contentType,
    });
  }

  public async createReviewImagePresignedUrls(
    createReviewImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3_FOLDER.REVIEW,
      extensions: createReviewImagePresignedUrlsDto.extensions,
      maxSize: createReviewImagePresignedUrlsDto.maxSize,
      contentType: createReviewImagePresignedUrlsDto.contentType,
    });
  }
}
