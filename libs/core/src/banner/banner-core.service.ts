import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerCoreRepository } from './banner-core.repository';
import { BannerModel } from './model/banner.model';
import { CreateBannerInput } from './inputs/create-banner.input';
import { UpdateBannerInput } from './inputs/update-banner.input';
import { Transactional } from '@nestjs-cls/transactional';
import { UpdateBannerSortOrderInput } from './inputs/update-banner-sort-order.input';

/**
 * BannerCoreService 클래스
 *
 * @publicApi
 */
@Injectable()
export class BannerCoreService {
  constructor(private readonly bannerRepository: BannerCoreRepository) {}

  public async getBannerByIdx(idx: number): Promise<BannerModel | null> {
    const banner = await this.bannerRepository.selectBannerByIdx(idx);
    return banner && BannerModel.fromPrisma(banner);
  }

  // public async getBannerAll(): Promise<BannerModel[]> {
  //   return await this.bannerRepository
  //     .selectBannerAll(input)
  //     .then((banners) => banners.map(BannerModel.fromPrisma));
  // }

  public async createBanner(input: CreateBannerInput): Promise<BannerModel> {
    return await this.bannerRepository
      .insertBanner(input)
      .then(BannerModel.fromPrisma);
  }

  public async updateBannerByIdx(
    idx: number,
    input: UpdateBannerInput,
  ): Promise<void> {
    await this.bannerRepository.updateBannerByIdx(idx, input);
  }

  public async deleteBannerByIdx(idx: number): Promise<void> {
    await this.bannerRepository.softDeleteBannerByIdx(idx);
  }

  public async updateSortOrderByIdx(
    idx: number,
    sortOrder: number | null,
  ): Promise<void> {
    await this.bannerRepository.updateSortOrderByIdx(idx, sortOrder);
  }

  public async decrementSortOrder(sortOrder: number): Promise<void> {
    await this.bannerRepository.decrementSortOrder(sortOrder);
  }

  public selectLastActive(): Promise<BannerModel | null> {
    return this.bannerRepository
      .selectLastActive()
      .then((banner) => (banner ? BannerModel.fromPrisma(banner) : null));
  }

  @Transactional()
  public async activateBannerByIdx(idx: number) {
    const last = await this.bannerRepository.selectLastActive();
    const newOrder = last ? last.sortOrder! + 1 : 1;

    await this.bannerRepository.updateBannerByIdx(idx, {
      activatedAt: new Date(),
    });

    await this.bannerRepository.updateSortOrderByIdx(idx, newOrder);
  }

  @Transactional()
  public async deactivateBannerByIdx(idx: number, sortOrder: number) {
    await this.bannerRepository.updateBannerByIdx(idx, { activatedAt: null });

    await this.bannerRepository.updateSortOrderByIdx(idx, null);

    await this.bannerRepository.decrementSortOrder(sortOrder);
  }

  public async updateBannerSortOrder(
    input: UpdateBannerSortOrderInput[],
  ): Promise<void> {
    for (const item of input) {
      await this.bannerRepository.updateSortOrderByIdx(
        item.idx,
        item.sortOrder,
      );
    }
  }
}
