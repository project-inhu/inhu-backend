import { Inject, Injectable } from '@nestjs/common';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { GetAllPlaceOverviewDto } from './dto/request/get-all-place-overview.dto';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { PlaceNotFoundException } from '@user/api/place/exception/place-not-found.exception';
import { GetAllBookmarkedPlaceOverviewPlaceDto } from '@user/api/place/dto/request/get-all-bookmarked-place-overview.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { GetAllPlaceOverviewMarkerDto } from './dto/request/get-all-place-overview-marker.dto';

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
    const pageSize = dto.take;
    const coordinate = {
      leftTopX: dto.leftTopX,
      rightBottomX: dto.rightBottomX,
      leftTopY: dto.leftTopY,
      rightBottomY: dto.rightBottomY,
    };

    const placeOverviewModelList = await this.placeCoreService.getPlaceAll({
      take: pageSize + 1,
      skip: (dto.page - 1) * pageSize,
      activated: true,
      permanentlyClosed: false,
      coordinate: this.isValidCoordinate(coordinate) ? coordinate : undefined,
      operating: dto.operating,
      order: dto.order,
      types: dto.type ? [dto.type] : undefined,
      orderBy: dto.orderby,
      bookmarkUserIdx: undefined,
    });

    const paginatedList = placeOverviewModelList.slice(0, pageSize);
    const hasNext = placeOverviewModelList.length > pageSize;

    if (!readUserIdx) {
      return {
        hasNext: hasNext,
        placeOverviewList: paginatedList.map((place) =>
          PlaceOverviewEntity.fromModel(place, false),
        ),
      };
    }

    const bookmarkedPlaceList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx: readUserIdx,
        placeIdxList: paginatedList.map(({ idx }) => idx),
      })
      .then((bookmarks) => bookmarks.map(({ placeIdx }) => placeIdx));

    return {
      hasNext: hasNext,
      placeOverviewList: paginatedList.map((place) =>
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

  public async getPlaceOverviewMarkerAll(
    dto: GetAllPlaceOverviewMarkerDto,
  ): Promise<{
    placeOverviewList: PlaceOverviewEntity[];
  }> {
    const placeOverviewModelList =
      await this.placeCoreService.getPlaceAllForMarker({
        orderBy: dto.orderby,
        order: dto.order,
        operating: dto.operating,
        types: dto.type ? [dto.type] : undefined,
        activated: true,
        permanentlyClosed: false,
      });

    return {
      placeOverviewList: placeOverviewModelList.map((place) =>
        PlaceOverviewEntity.fromModel(place, false),
      ),
    };
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

  public async getBookmarkedPlaceOverview(
    dto: GetAllBookmarkedPlaceOverviewPlaceDto,
    userIdx: number,
  ): Promise<{
    hasNext: boolean;
    placeOverviewList: PlaceOverviewEntity[];
  }> {
    const coordinate = {
      leftTopX: dto.leftTopX,
      rightBottomX: dto.rightBottomX,
      leftTopY: dto.leftTopY,
      rightBottomY: dto.rightBottomY,
    };

    const placeList = await this.placeCoreService.getBookmarkedPlace({
      take: 11,
      skip: (dto.page - 1) * 10,
      userIdx,
      activated: true,
      permanentlyClosed: false,
      coordinate: this.isValidCoordinate(coordinate) ? coordinate : undefined,
      operating: dto.operating,
      order: dto.order,
      types: dto.type ? [dto.type] : undefined,
    });

    return {
      hasNext: placeList.length > 10,
      placeOverviewList: placeList
        .slice(0, 10)
        .map((place) => PlaceOverviewEntity.fromModel(place, true)),
    };
  }
}
