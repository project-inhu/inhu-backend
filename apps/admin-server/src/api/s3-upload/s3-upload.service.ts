import { PresignedUrlModel, S3_FOLDER, S3Service } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { CreateBannerImagePresignedUrlDto } from './dto/request/create-banner-image-presigned-url.dto';

@Injectable()
export class S3UploadService {
  constructor(private readonly s3Service: S3Service) {}

  public async createBannerImagePresignedUrl(
    createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.BANNER,
      extension: createBannerImagePresignedUrlDto.extension,
    });
  }

  public async createMenuImagePresignedUrl(
    createMenuImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlModel> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.MENU,
      extension: createMenuImagePresignedUrlDto.extension,
    });
  }
}
