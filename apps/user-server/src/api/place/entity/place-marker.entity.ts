import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceMarkerModel } from '@libs/core/place/model/place-marker.model';
import { PlaceClosedDayEntity } from './place-closed-day.entity';
import { PlaceOperatingHourEntity } from './place-operating-hour.entity';
import { PlaceWeeklyClosedDayEntity } from './place-weekly-closed-day.entity';
import { PlaceBreakTimeEntity } from './place-break-time.entity';

export class PlaceMarkerEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'bookmark',
  'imagePathList',
  'type',
  'closedDayList',
  'operatingHourList',
  'weeklyClosedDayList',
  'breakTimeList',
]) {
  constructor(data: PlaceMarkerEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceMarkerModel,
    bookmark: boolean,
  ): PlaceMarkerEntity {
    return new PlaceMarkerEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      reviewCount: model.reviewCount,
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      bookmark,
      imagePathList: model.imgPathList,
      type: model.type,
      closedDayList: model.closedDayList.map(PlaceClosedDayEntity.fromModel),
      operatingHourList: model.operatingHourList.map(
        PlaceOperatingHourEntity.fromModel,
      ),
      weeklyClosedDayList: model.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayEntity.fromModel,
      ),
      breakTimeList: model.breakTimeList.map(PlaceBreakTimeEntity.fromModel),
    });
  }
}
