import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';
import { Prisma } from '@prisma/client';
import { GetAllPlaceOverviewResponseDto } from './dto/get-all-place-overview-response.dto';
import { SelectPlaceOverviewInput } from 'src/api/place/input/select-place-overview-input';
import { GetAllPlaceOverviewDto } from 'src/api/place/dto/request/get-all-place-overview.dto';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  /**
   * 모든 place 개요 가져오기
   *
   * @author 강정연
   */
  async getAllPlaceOverview(
    dto: GetAllPlaceOverviewDto,
    readUserIdx?: number,
  ): Promise<GetAllPlaceOverviewResponseDto> {
    const PAGE_SIZE = 10;

    const coordinate = {
      leftTopX: dto.leftTopX,
      leftTopY: dto.leftTopY,
      rightBottomX: dto.rightBottomX,
      rightBottomY: dto.rightBottomY,
    };

    const placeList = await this.placeRepository.selectAllPlaceOverview({
      order: dto.order,
      orderBy: dto.orderby,
      readUserIdx,
      take: PAGE_SIZE + 1,
      skip: (dto.page - 1) * PAGE_SIZE,
      operating: dto.operating,
      bookmarkUserIdx: dto.bookmark && readUserIdx ? readUserIdx : undefined,
      coordinate: this.isValidCoordinate(coordinate) ? coordinate : undefined,
      types: dto.type ? [dto.type] : undefined,
    });

    const hasNext = !!placeList[PAGE_SIZE];

    return {
      hasNext,
      data: placeList
        .slice(0, PAGE_SIZE)
        .map(PlaceOverviewEntity.createEntityFromPrisma),
    };
  }

  private isValidCoordinate(coordinate: {
    leftTopX?: number;
    leftTopY?: number;
    rightBottomX?: number;
    rightBottomY?: number;
  }): coordinate is {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  } {
    return (
      coordinate.leftTopX !== undefined &&
      coordinate.leftTopY !== undefined &&
      coordinate.rightBottomX !== undefined &&
      coordinate.rightBottomY !== undefined
    );
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

  // /**
  //  * 특정 idx의 place review count 업데이트
  //  *
  //  * @author 강정연
  //  */
  // async updatePlaceReviewCountByPlaceIdx(
  //   placeIdx: number,
  //   updateType: ReviewCountUpdateType,
  //   tx?: Prisma.TransactionClient,
  // ): Promise<void> {
  //   const value = updateType == ReviewCountUpdateType.INCREASE ? 1 : -1;

  //   await this.placeRepository.updatePlaceReviewCountByPlaceIdx(
  //     placeIdx,
  //     value,
  //     tx,
  //   );
  // }

  // async getAllPlaceOverviewByNow(page: number, userIdx?: number) {
  //   const pageSize = 10;
  //   const take = pageSize + 1;
  //   const skip = (page - 1) * pageSize;

  //   const now = new Date();
  //   const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
  //   const day = now.getDay(); // 요일
  //   const time = now.toISOString().split('T')[1].slice(0, 8); // HH:MM:SS
  // }
}
