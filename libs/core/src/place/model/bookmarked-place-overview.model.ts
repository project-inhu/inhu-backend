import { SelectBookmarkedPlaceOverview } from './prisma-type/select-bookmarked-place-overview';
import { PlaceOverviewModel } from './place-overview.model';
import { PickType } from '@nestjs/swagger';
import { KeywordModel } from '@app/core/keyword/model/keyword.model';
import { PlaceRoadAddressModel } from '@app/core/place/model/place-road-address.model';
import { PlaceType } from '@app/core';

export class BookmarkedPlaceOverviewModel extends PickType(PlaceOverviewModel, [
  'idx',
  'name',
  'tel',
  'reviewCount',
  'bookmarkCount',
  'isClosedOnHoliday',
  'createdAt',
  'permanentlyClosedAt',
  'imgPathList',
  'activatedAt',
  'topKeywordList',
  'roadAddress',
  'type',
]) {
  public bookmarkAt: Date;

  constructor(data: BookmarkedPlaceOverviewModel) {
    super(data);
    Object.assign(this, data);
  }

  public static fromPrisma({
    place,
    createdAt,
  }: SelectBookmarkedPlaceOverview): BookmarkedPlaceOverviewModel {
    return new BookmarkedPlaceOverviewModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      reviewCount: place.reviewCount,
      bookmarkCount: place.bookmarkCount,
      isClosedOnHoliday: place.isClosedOnHoliday,
      createdAt: place.createdAt,
      activatedAt: place.activatedAt,
      permanentlyClosedAt: place.permanentlyClosedAt,
      imgPathList: place.placeImageList.map((image) => image.path),
      topKeywordList: place.placeKeywordCountList.map(({ keyword }) =>
        KeywordModel.fromPrisma(keyword),
      ),
      bookmarkAt: createdAt,
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
    });
  }
}
