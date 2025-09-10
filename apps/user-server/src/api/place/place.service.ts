import { Injectable } from '@nestjs/common';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { GetAllPlaceOverviewDto } from './dto/request/get-all-place-overview.dto';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { PlaceNotFoundException } from '@user/api/place/exception/place-not-found.exception';
import { GetAllBookmarkedPlaceOverviewPlaceDto } from '@user/api/place/dto/request/get-all-bookmarked-place-overview.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';
import { GetAllPlaceMarkerDto } from './dto/request/get-all-place-marker.dto';
import { PlaceMarkerEntity } from './entity/place-marker.entity';
import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';

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
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    const placeOverviewModelList = await this.placeCoreService.getPlaceAll({
      take: pageSize + 1,
      skip: skip,
      orderBy: dto.orderby,
      order: dto.order,
      operating: dto.operating,
      bookmarkUserIdx: undefined,
      types: dto.type ? [dto.type] : undefined,
      activated: true,
      permanentlyClosed: false,
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
      GetAllPlaceMarkerDto,
      'leftTopX' | 'rightBottomX' | 'leftTopY' | 'rightBottomY'
    >,
  ): coordinate is Required<
    Pick<
      GetAllPlaceMarkerDto,
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

  public async getPlaceMarkerAll(dto: GetAllPlaceMarkerDto): Promise<{
    placeMarkerList: PlaceMarkerEntity[];
  }> {
    const coordinate = {
      leftTopX: dto.leftTopX,
      rightBottomX: dto.rightBottomX,
      leftTopY: dto.leftTopY,
      rightBottomY: dto.rightBottomY,
    };

    const placeMarkerModelList = await this.placeCoreService.getPlaceMarkerAll({
      orderBy: dto.orderby,
      order: dto.order,
      operating: dto.operating,
      types: dto.type ? [dto.type] : undefined,
      activated: true,
      permanentlyClosed: false,
      searchKeyword: dto.searchKeyword,
      coordinate: this.isValidCoordinate(coordinate) ? coordinate : undefined,
    });

    return {
      placeMarkerList: placeMarkerModelList.map((place) =>
        PlaceMarkerEntity.fromModel(place, false),
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

  public async getOwnerPlaceAll(userIdx: number): Promise<PlaceEntity[]> {
    return (await this.placeCoreService.getOwnerPlaceAllByUserIdx(userIdx)).map(
      (place) => PlaceEntity.fromModel(place, false),
    );
  }
}
