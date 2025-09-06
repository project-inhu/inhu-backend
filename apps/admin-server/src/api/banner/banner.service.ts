import { BannerCoreService } from '@libs/core/banner/banner-core.service';
import { CreateBannerInput } from '@libs/core/banner/inputs/create-banner.input';
import { Injectable } from '@nestjs/common';
import { UpdateBannerInput } from '@libs/core/banner/inputs/update-banner.input';
import { BannerEntity } from './entity/banner.entity';
import { BannerNotFoundException } from './exception/banner-not-found.exception';
import { AlreadyActivatedBannerException } from './exception/already-activate-banner.exception';
import { AlreadyDeactivatedBannerException } from './exception/already-deactivated-banner.exception';

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

  public async createBanner(input: CreateBannerInput): Promise<BannerEntity> {
    const banner = await this.bannerCoreService.createBanner(input);
    return BannerEntity.fromModel(banner);
  }

  public async updateBannerByIdx(
    idx: number,
    input: UpdateBannerInput,
  ): Promise<void> {
    const banner = await this.bannerCoreService.getBannerByIdx(idx);
    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner with idx: ' + idx);
    }

    await this.bannerCoreService.updateBannerByIdx(idx, input);
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
}
