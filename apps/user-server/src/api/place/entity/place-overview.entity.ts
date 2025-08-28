import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
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
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceOverviewModel,
    bookmark: boolean,
  ): PlaceOverviewEntity {
    return new PlaceOverviewEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      reviewCount: model.reviewCount,
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      bookmark,
      imagePathList: model.imgPathList,
      type: model.type,
      closedDayList: model.closedDayList,
      operatingHourList: model.operatingHourList,
      weeklyClosedDayList: model.weeklyClosedDayList,
      breakTimeList: model.breakTimeList,
    });
  }
}
