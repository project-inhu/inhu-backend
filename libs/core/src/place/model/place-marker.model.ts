import { PickType } from '@nestjs/swagger';
import { PlaceModel } from './place.model';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';
import { PlaceRoadAddressModel } from './place-road-address.model';
import { PlaceType } from '../constants/place-type.constant';
import { SelectPlaceMarker } from './prisma-type/select-place-marker';
import { PlaceClosedDayModel } from './place-closed-day.model';
import { PlaceOperatingHourModel } from './place-operating-hour.model';
import { PlaceWeeklyClosedDayModel } from './place-weekly-closed-day.model';
import { PlaceBreakTimeModel } from './place-break-time.model';

/**
 * 장소 개요 모델
 *
 * @publicApi
 */
export class PlaceMarkerModel extends PickType(PlaceModel, [
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
  constructor(data: PlaceMarkerModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectPlaceMarker): PlaceMarkerModel {
    return new PlaceMarkerModel({
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
