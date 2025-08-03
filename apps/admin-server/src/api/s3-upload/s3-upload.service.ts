import { Injectable } from '@nestjs/common';
import { CreateBannerImagePresignedUrlDto } from './dto/request/create-banner-image-presigned-url.dto';
import { CreateMenuImagePresignedUrlDto } from './dto/request/create-menu-image-presigned-url.dto';
import { CreatePlaceImagePresignedUrlsDto } from './dto/request/create-place-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3_FOLDER } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { CONTENT_TYPE } from '@libs/common/modules/s3/constants/content-type.constants';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createBannerImagePresignedUrl(
    createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.BANNER,
      extension: createBannerImagePresignedUrlDto.extension,
      maxSize: 10,
      contentType: CONTENT_TYPE.IMAGE,
    });
  }

  public async createMenuImagePresignedUrl(
    createMenuImagePresignedUrlDto: CreateMenuImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.MENU,
      extension: createMenuImagePresignedUrlDto.extension,
      maxSize: 10,
      contentType: CONTENT_TYPE.IMAGE,
    });
  }

  public async createPlaceImagePresignedUrls(
    createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3_FOLDER.PLACE,
      extensions: createPlaceImagePresignedUrlsDto.extensions,
      maxSize: 10,
      contentType: CONTENT_TYPE.IMAGE,
    });
  }

  public async createReviewImagePresignedUrls(
    createReviewImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3_FOLDER.REVIEW,
      extensions: createReviewImagePresignedUrlsDto.extensions,
      maxSize: 10,
      contentType: CONTENT_TYPE.IMAGE,
    });
  }
}
