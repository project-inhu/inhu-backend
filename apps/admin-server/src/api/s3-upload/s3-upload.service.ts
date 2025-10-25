import { Injectable } from '@nestjs/common';
import { CreateBannerImagePresignedUrlDto } from './dto/request/create-banner-image-presigned-url.dto';
import { CreateMenuImagePresignedUrlDto } from './dto/request/create-menu-image-presigned-url.dto';
import { CreatePlaceImagePresignedUrlsDto } from './dto/request/create-place-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { ContentType } from '@libs/common/modules/s3/constants/content-type.constants';
import { CreateMagazineImagePresignedUrlsDto } from './dto/request/create-magazine-image-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createBannerImagePresignedUrl(
    createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3Folder.BANNER,
      extension: createBannerImagePresignedUrlDto.extension,
      maxSize: 10,
      contentType: ContentType.IMAGE,
    });
  }

  public async createMenuImagePresignedUrl(
    createMenuImagePresignedUrlDto: CreateMenuImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3Folder.MENU,
      extension: createMenuImagePresignedUrlDto.extension,
      maxSize: 10,
      contentType: ContentType.IMAGE,
    });
  }

  public async createPlaceImagePresignedUrls(
    createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3Folder.PLACE,
      extensions: createPlaceImagePresignedUrlsDto.extensions,
      maxSize: 10,
      contentType: ContentType.IMAGE,
    });
  }

  public async createMagazineImagePresignedUrls(
    createMagazineImagePresignedUrlsDto: CreateMagazineImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3Folder.MAGAZINE,
      extensions: createMagazineImagePresignedUrlsDto.extensions,
      maxSize: 5,
      contentType: ContentType.IMAGE,
    });
  }
}
