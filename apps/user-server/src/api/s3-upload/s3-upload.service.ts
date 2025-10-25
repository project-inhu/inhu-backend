import { Injectable } from '@nestjs/common';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { PresignedUrlModel } from '@libs/common/modules/s3/model/presigned-url.model';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { ContentType } from '@libs/common/modules/s3/constants/content-type.constants';
import { CreateReviewImagePresignedUrlsDto } from './dto/request/create-review-image-presigned-url.dto';
import { CreateMagazineImagePresignedUrlsDto } from './dto/request/create-magazine-image-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createProfileImagePresignedUrl(
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3Folder.PROFILE,
      extension: createProfileImagePresignedUrlDto.extension,
      maxSize: 5,
      contentType: ContentType.IMAGE,
    });
  }

  public async createReviewImagePresignedUrls(
    createReviewImagePresignedUrlsDto: CreateReviewImagePresignedUrlsDto,
  ): Promise<PresignedUrlModel[]> {
    return this.s3Service.getPresignedUrls({
      folder: S3Folder.REVIEW,
      extensions: createReviewImagePresignedUrlsDto.extensions,
      maxSize: 5,
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
