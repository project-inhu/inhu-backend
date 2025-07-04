import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';
import { ReviewCountUpdateType } from './common/constants/review-count-update-type.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  async getAllPlaceOverview(
    page: number,
    userIdx?: number,
  ): Promise<PlaceOverviewEntity[]> {
    return (
      await this.placeRepository.selectAllPlaceOverview(page, userIdx)
    ).map(PlaceOverviewEntity.createEntityFromPrisma);
  }

  async getPlaceByPlaceIdx(
    placeIdx: number,
    userIdx?: number,
  ): Promise<PlaceEntity> {
    const place = await this.placeRepository.selectPlaceByPlaceIdx(
      placeIdx,
      userIdx,
    );

    if (!place) {
      throw new NotFoundException('place not found');
    }

    return PlaceEntity.createEntityFromPrisma(place);
  }

  async updatePlaceReviewCountByPlaceIdx(
    placeIdx: number,
    updateType: ReviewCountUpdateType,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const value = updateType == ReviewCountUpdateType.INCREASE ? 1 : -1;

    await this.placeRepository.updatePlaceReviewCountByPlaceIdx(
      placeIdx,
      value,
      tx,
    );
  }
}
