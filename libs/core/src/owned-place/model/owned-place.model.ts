import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';
import { SelectOwnedPlace } from './prisma-type/select-owned-place';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { PlaceClosedDayModel } from '@libs/core/place/model/place-closed-day.model';
import { PlaceOperatingHourModel } from '@libs/core/place/model/place-operating-hour.model';
import { PlaceWeeklyClosedDayModel } from '@libs/core/place/model/place-weekly-closed-day.model';
import { PlaceBreakTimeModel } from '@libs/core/place/model/place-break-time.model';
import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';

export class OwnedPlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'tel',
  'reviewCount',
  'bookmarkCount',
  'isClosedOnHoliday',
  'createdAt',
  'activatedAt',
  'permanentlyClosedAt',
  'imgPathList',
  'type',
  'closedDayList',
  'operatingHourList',
  'weeklyClosedDayList',
  'breakTimeList',
  'roadAddress',
  'topKeywordList',
]) {
  constructor(data: OwnedPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectOwnedPlace): OwnedPlaceModel {
    return new OwnedPlaceModel({
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
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
      closedDayList: place.closedDayList.map(PlaceClosedDayModel.fromPrisma),
      operatingHourList: place.operatingHourList.map(
        PlaceOperatingHourModel.fromPrisma,
      ),
      weeklyClosedDayList: place.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayModel.fromPrisma,
      ),
      breakTimeList: place.breakTimeList.map(PlaceBreakTimeModel.fromPrisma),
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
      topKeywordList: place.placeKeywordCountList.map(({ keyword }) =>
        KeywordModel.fromPrisma(keyword),
      ),
    });
  }
}
