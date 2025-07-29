import { Injectable } from '@nestjs/common';
import { GetAllPlaceOverviewDto } from '../place/dto/request/get-all-place-overview.dto';
import { PickedPlaceOverviewEntity } from './entity/picked-place.overview.entity';
import { BookmarkCoreService, PickedPlaceCoreService } from '@libs/core';
import { GetAllPickedPlaceOverviewDto } from './dto/request/get-all-picked-place-overview.dto';

@Injectable()
export class PickedPlaceService {
  constructor(
    private readonly pickedPlaceCoreService: PickedPlaceCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

  /**
   * 선정된 장소 개요 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  async getAllPickedPlaceOverview(
    dto: GetAllPickedPlaceOverviewDto,
    userIdx?: number,
  ): Promise<{
    pickedPlaceOverviewList: PickedPlaceOverviewEntity[];
    hasNext: boolean;
  }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const pickedPlaceModelList =
      await this.pickedPlaceCoreService.getPickedPlaceAll({
        take,
        skip,
        ...dto,
      });

    const hasNext = pickedPlaceModelList.length > pageSize;
    const paginatedList = pickedPlaceModelList.slice(0, pageSize);

    if (!userIdx) {
      return {
        pickedPlaceOverviewList: paginatedList.map((pickedPlace) =>
          PickedPlaceOverviewEntity.fromModel(pickedPlace, false),
        ),
        hasNext,
      };
    }

    const bookmarkedPlaceIdxList = await this.bookmarkCoreService
      .getBookmarkStateByUserIdx({
        userIdx,
        placeIdxList: paginatedList.map(({ place }) => place.idx),
      })
      .then((bookmarks) => bookmarks.map(({ placeIdx }) => placeIdx));

    return {
      pickedPlaceOverviewList: paginatedList.map((pickedPlace) =>
        PickedPlaceOverviewEntity.fromModel(
          pickedPlace,
          bookmarkedPlaceIdxList.includes(pickedPlace.place.idx),
        ),
      ),
      hasNext,
    };
  }
}
