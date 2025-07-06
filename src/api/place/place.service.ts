import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';
import { ReviewCountUpdateType } from './common/constants/review-count-update-type.enum';
import { Prisma } from '@prisma/client';
import { PlaceOverviewOrderBy } from './common/constants/enums/place-overview-order-by.enum';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  // 클라이언트의 정렬 기준을 Prisma 쿼리 옵션(orderby)으로 매핑
  private readonly orderByMap: Record<
    PlaceOverviewOrderBy,
    | Prisma.PlaceOrderByWithRelationInput
    | Prisma.PlaceOrderByWithRelationInput[]
  > = {
    [PlaceOverviewOrderBy.CREATED_AT_DESC]: { createdAt: 'desc' },
    [PlaceOverviewOrderBy.REVIEW_COUNT_DESC]: [
      { reviewCount: 'desc' },
      { createdAt: 'desc' },
    ],
  };

  async getAllPlaceOverview(
    page: number,
    orderBy?: PlaceOverviewOrderBy,
    userIdx?: number,
  ): Promise<PlaceOverviewEntity[]> {
    let orderByOption;
    if (orderBy && this.orderByMap[orderBy]) {
      orderByOption = this.orderByMap[orderBy];
    }
    return (
      await this.placeRepository.selectAllPlaceOverview(
        page,
        orderByOption,
        userIdx,
      )
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
