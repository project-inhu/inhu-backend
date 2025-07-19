import { PickType } from '@nestjs/swagger';
import { PlaceModel } from './place.model';
import { SelectPlaceOverview } from './prisma-type/select-place-overview';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';
import { PlaceRoadAddressModel } from './place-road-address.model';
import { PlaceType } from '../constants/place-type.constant';

export class PlaceOverviewModel extends PickType(PlaceModel, [
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
  constructor(data: PlaceOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectPlaceOverview): PlaceOverviewModel {
    return new PlaceOverviewModel({
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
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
    });
  }
}
