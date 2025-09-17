import { BannerCoreService } from '@libs/core/banner/banner-core.service';
import { Injectable } from '@nestjs/common';
import { BannerEntity } from './entity/banner.entity';
import { BannerNotFoundException } from './exception/banner-not-found.exception';
import { AlreadyActivatedBannerException } from './exception/already-activated-banner.exception';
import { AlreadyDeactivatedBannerException } from './exception/already-deactivated-banner.exception';
import { CreateBannerDto } from './dto/request/create-banner.dto';
import { UpdateBannerDto } from './dto/request/update-banner.dto';
import { UpdateBannerSortOrderDto } from './dto/request/update-banner-sort-order.dto';
import { CannotUpdateInactiveBannerException } from './exception/can-not-update-inactive-banner.exception';
import { GetAllBannerDto } from './dto/request/get-all-banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly bannerCoreService: BannerCoreService) {}

  public async getBannerByIdx(idx: number): Promise<BannerEntity> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }
    return BannerEntity.fromModel(banner);
  }

  public async getAllBanner(
    dto: GetAllBannerDto,
  ): Promise<{ bannerList: BannerEntity[]; hasNext: boolean }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const bannerList = await this.bannerCoreService.getBannerAll({
      take,
      skip,
      ...dto,
    });

    return {
      bannerList: bannerList.slice(0, pageSize).map(BannerEntity.fromModel),
      hasNext: bannerList.length > pageSize,
    };
  }

  public async createBanner(dto: CreateBannerDto): Promise<BannerEntity> {
    const banner = await this.bannerCoreService.createBanner({
      name: dto.name,
      imagePath: dto.imagePath,
      link: dto.link,
      activatedAt: null,
    });
    return BannerEntity.fromModel(banner);
  }

  public async updateBannerByIdx(
    idx: number,
    dto: UpdateBannerDto,
  ): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    await this.bannerCoreService.updateBannerByIdx(idx, {
      name: dto.name,
      imagePath: dto.imagePath,
      link: dto.link,
    });
  }

  public async deleteBannerByIdx(idx: number): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    await this.bannerCoreService.deleteBannerByIdx(idx);
  }

  public async activateBannerByIdx(idx: number): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    if (banner.activatedAt) {
      throw new AlreadyActivatedBannerException(
        'Banner is already activated: ' + idx,
      );
    }

    await this.bannerCoreService.activateBannerByIdx(idx);
  }

  public async deactivateBannerByIdx(idx: number): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    if (!banner.activatedAt || banner.sortOrder === null) {
      throw new AlreadyDeactivatedBannerException(
        'Banner is already deactivated: ' + idx,
      );
    }

    await this.bannerCoreService.deactivateBannerByIdx(idx, banner.sortOrder);
  }

  public async updateBannerSortOrder(
    idx: number,
    dto: UpdateBannerSortOrderDto,
  ): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    if (!banner.activatedAt || banner.sortOrder === null) {
      throw new CannotUpdateInactiveBannerException(
        'Cannot update sort order of inactive banner: ' + idx,
      );
    }

    await this.bannerCoreService.updateBannerSortOrderByIdx(
      idx,
      banner.sortOrder,
      dto.sortOrder,
    );
  }
}
