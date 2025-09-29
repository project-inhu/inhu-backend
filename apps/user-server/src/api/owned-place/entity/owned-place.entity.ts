import { OwnedPlaceModel } from '@libs/core/owned-place/model/owned-place.model';
import { PickType } from '@nestjs/swagger';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceBreakTimeEntity } from '@user/api/place/entity/place-break-time.entity';
import { PlaceClosedDayEntity } from '@user/api/place/entity/place-closed-day.entity';
import { PlaceOperatingHourEntity } from '@user/api/place/entity/place-operating-hour.entity';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { PlaceWeeklyClosedDayEntity } from '@user/api/place/entity/place-weekly-closed-day.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';

export class OwnedPlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'topKeywordList',
  'createdAt',
  'reviewCount',
  'isClosedOnHoliday',
  'imagePathList',
  'type',
  'weeklyClosedDayList',
  'operatingHourList',
  'closedDayList',
  'breakTimeList',
]) {
  constructor(data: OwnedPlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: OwnedPlaceModel): OwnedPlaceEntity {
    return new OwnedPlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      createdAt: model.createdAt,
      reviewCount: model.reviewCount,
      isClosedOnHoliday: model.isClosedOnHoliday,
      imagePathList: model.imgPathList,
      type: model.type,
      weeklyClosedDayList: model.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayEntity.fromModel,
      ),
      operatingHourList: model.operatingHourList.map(
        PlaceOperatingHourEntity.fromModel,
      ),
      closedDayList: model.closedDayList.map(PlaceClosedDayEntity.fromModel),
      breakTimeList: model.breakTimeList.map(PlaceBreakTimeEntity.fromModel),
    });
  }
}
