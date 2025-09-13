import { PickType } from '@nestjs/swagger';
import { OwnedPlaceModel } from './owned-place.model';
import { SelectOwnedPlaceOverview } from './prisma-type/select-owned-place-overview';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { PlaceClosedDayModel } from '@libs/core/place/model/place-closed-day.model';
import { PlaceOperatingHourModel } from '@libs/core/place/model/place-operating-hour.model';
import { PlaceWeeklyClosedDayModel } from '@libs/core/place/model/place-weekly-closed-day.model';
import { PlaceBreakTimeModel } from '@libs/core/place/model/place-break-time.model';
import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';

export class OwnedPlaceOverviewModel extends PickType(OwnedPlaceModel, [
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
  constructor(data: OwnedPlaceOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    place: SelectOwnedPlaceOverview,
  ): OwnedPlaceOverviewModel {
    return new OwnedPlaceOverviewModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      reviewCount: place.reviewCount,
      bookmarkCount: place.bookmarkCount,
      isClosedOnHoliday: place.isClosedOnHoliday,
      createdAt: place.createdAt,
      activatedAt: place.activatedAt,
      permanentlyClosedAt: place.permanentlyClosedAt,
      imgPathList: place.placeImageList.map((image) => image.imagePath),
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
