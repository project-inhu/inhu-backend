import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerCoreRepository } from './banner-core.repository';
import { BannerModel } from './model/banner.model';
import { CreateBannerInput } from './inputs/create-banner.input';
import { UpdateBannerInput } from './inputs/update-banner.input';
import { Transactional } from '@nestjs-cls/transactional';
import { GetBannerAllInput } from './inputs/get-banner-all.input';

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

  public async getBannerAll(input: GetBannerAllInput): Promise<BannerModel[]> {
    return await this.bannerRepository
      .selectBannerAll(input)
      .then((banners) => banners.map(BannerModel.fromPrisma));
  }

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

  @Transactional()
  public async deleteBannerByIdx(idx: number): Promise<void> {
    const banner = await this.bannerRepository.selectBannerByIdx(idx);
    if (!banner) return;

    if (banner.activatedAt && banner.sortOrder !== null) {
      await this.bannerRepository.updateManyBannerSortOrder(
        -1,
        'gt',
        banner.sortOrder,
      );
    }

    await this.bannerRepository.softDeleteBannerByIdx(idx);
  }

  @Transactional()
  public async activateBannerByIdx(idx: number): Promise<void> {
    const count = await this.bannerRepository.getActiveBannerCount();

    await this.bannerRepository.updateBannerByIdx(idx, {
      activatedAt: new Date(),
    });

    await this.bannerRepository.updateSortOrderByIdx(idx, count + 1);
  }

  @Transactional()
  public async deactivateBannerByIdx(
    idx: number,
    sortOrder: number,
  ): Promise<void> {
    await this.bannerRepository.updateBannerByIdx(idx, { activatedAt: null });

    await this.bannerRepository.updateSortOrderByIdx(idx, null);

    await this.bannerRepository.updateManyBannerSortOrder(-1, 'gt', sortOrder);
  }

  @Transactional()
  public async updateBannerSortOrderByIdx(
    idx: number,
    currentSortOrder: number,
    newSortOrder: number,
  ) {
    if (currentSortOrder === newSortOrder) return;

    if (currentSortOrder < newSortOrder) {
      await this.bannerRepository.updateManyBannerSortOrder(
        -1,
        'gt',
        currentSortOrder,
        'lte',
        newSortOrder,
      );
    } else {
      await this.bannerRepository.updateManyBannerSortOrder(
        1,
        'gte',
        newSortOrder,
        'lt',
        currentSortOrder,
      );
    }

    await this.bannerRepository.updateSortOrderByIdx(idx, newSortOrder);
  }
}
