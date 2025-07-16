import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';
import { ReviewCountUpdateType } from './common/enums/review-count-update-type.enum';
import { Prisma } from '@prisma/client';
import { PlaceOverviewOrderBy } from './common/enums/place-overview-order-by.enum';
import { GetAllPlaceOverviewResponseDto } from './dto/get-all-place-overview-response.dto';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  /**
   * 클라이언트의 정렬 기준을 Prisma 쿼리 옵션(orderby)으로 매핑
   *
   * @author 강정연
   */
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

  /**
   * 모든 place 개요 가져오기
   *
   * @author 강정연
   */
  async getAllPlaceOverview(
    page: number,
    orderBy?: PlaceOverviewOrderBy,
    userIdx?: number,
  ): Promise<GetAllPlaceOverviewResponseDto> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (page - 1) * pageSize;

    let orderByOption;
    if (orderBy && this.orderByMap[orderBy]) {
      orderByOption = this.orderByMap[orderBy];
    }
    let placeList = await this.placeRepository.selectAllPlaceOverview(
      skip,
      take,
      orderByOption,
      userIdx,
    );

    const hasNext = !!placeList[pageSize];
    placeList = placeList.slice(0, pageSize);

    return {
      hasNext,
      data: placeList.map(PlaceOverviewEntity.createEntityFromPrisma),
    };
  }

  /**
   * 특정 idx의 place 관련 모든 정보 가져오기
   *
   * @author 강정연
   */
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

  /**
   * 특정 idx의 place review count 업데이트
   *
   * @author 강정연
   */
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

  async getAllPlaceOverviewByNow(page: number, userIdx?: number) {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (page - 1) * pageSize;

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const day = now.getDay(); // 요일
    const time = now.toISOString().split('T')[1].slice(0, 8); // HH:MM:SS
  }
}
