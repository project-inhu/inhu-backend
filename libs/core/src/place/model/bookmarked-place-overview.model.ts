import { SelectBookmarkedPlaceOverview } from './prisma-type/select-bookmarked-place-overview';
import { PlaceOverviewModel } from './place-overview.model';
import { PickType } from '@nestjs/swagger';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';
import { PlaceRoadAddressModel } from './place-road-address.model';
import { PlaceType } from '../constants/place-type.constant';
import { PlaceClosedDayModel } from './place-closed-day.model';
import { PlaceOperatingHourModel } from './place-operating-hour.model';
import { PlaceWeeklyClosedDayModel } from './place-weekly-closed-day.model';
import { PlaceBreakTimeModel } from './place-break-time.model';

/**
 * 북마크된 장소 개요 모델
 *
 * @publicApi
 */
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
  'closedDayList',
  'operatingHourList',
  'weeklyClosedDayList',
  'breakTimeList',
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
      closedDayList: place.closedDayList.map(PlaceClosedDayModel.fromPrisma),
      operatingHourList: place.operatingHourList.map(
        PlaceOperatingHourModel.fromPrisma,
      ),
      weeklyClosedDayList: place.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayModel.fromPrisma,
      ),
      breakTimeList: place.breakTimeList.map(PlaceBreakTimeModel.fromPrisma),
    });
  }
}
