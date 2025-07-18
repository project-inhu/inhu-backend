import { BookmarkCoreService, PlaceCoreService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { GetAllPlaceOverviewDto } from './dto/request/get-all-place-overview.dto';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { PlaceNotFoundException } from '@user/api/place/exception/place-not-found.exception';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

  public async getPlaceOverviewAll(
    dto: GetAllPlaceOverviewDto,
    readUserIdx?: number,
  ): Promise<{
    placeOverviewList: PlaceOverviewEntity[];
    hasNext: boolean;
  }> {
    const coordinate = {
      leftTopX: dto.leftTopX,
      rightBottomX: dto.rightBottomX,
      leftTopY: dto.leftTopY,
      rightBottomY: dto.rightBottomY,
    };

    const placeOverviewModelList = await this.placeCoreService.getPlaceAll({
      take: 11,
      skip: (dto.page - 1) * 10,
      activated: true,
      permanentlyClosed: false,
      coordinate: this.isValidCoordinate(coordinate) ? coordinate : undefined,
      operating: dto.operating,
      order: dto.order,
      types: dto.type ? [dto.type] : undefined,
      orderBy: dto.orderby,
      bookmarkUserIdx: undefined,
    });

    if (!readUserIdx) {
      return {
        hasNext: placeOverviewModelList.length > 10,
        placeOverviewList: placeOverviewModelList
          .slice(0, 10)
          .map((place) => PlaceOverviewEntity.fromModel(place, false)),
      };
    }

    const bookmarkedPlaceList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx: readUserIdx,
        placeIdxList: placeOverviewModelList.map(({ idx }) => idx),
      })
      .then((bookmarks) => bookmarks.map(({ placeIdx }) => placeIdx));

    return {
      hasNext: placeOverviewModelList.length > 10,
      placeOverviewList: placeOverviewModelList.map((place) =>
        PlaceOverviewEntity.fromModel(
          place,
          bookmarkedPlaceList.includes(place.idx),
        ),
      ),
    };
  }

  private isValidCoordinate(
    coordinate: Pick<
      GetAllPlaceOverviewDto,
      'leftTopX' | 'rightBottomX' | 'leftTopY' | 'rightBottomY'
    >,
  ): coordinate is Required<
    Pick<
      GetAllPlaceOverviewDto,
      'leftTopX' | 'rightBottomX' | 'leftTopY' | 'rightBottomY'
    >
  > {
    return (
      coordinate.leftTopX !== undefined &&
      coordinate.rightBottomX !== undefined &&
      coordinate.leftTopY !== undefined &&
      coordinate.rightBottomY !== undefined
    );
  }

  public async getPlaceByIdx(
    idx: number,
    readUserIdx?: number,
  ): Promise<PlaceEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place || !place.activatedAt) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    if (!readUserIdx) {
      return PlaceEntity.fromModel(place, false);
    }

    const bookmark = await this.bookmarkCoreService.getBookmarkByIdx({
      placeIdx: idx,
      userIdx: readUserIdx,
    });

    return PlaceEntity.fromModel(place, bookmark !== null);
  }
}
