import { OwnedPlaceOverviewModel } from '@libs/core/owned-place/model/owned-place-overview.model';
import { PickType } from '@nestjs/swagger';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';

export class OwnedPlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'topKeywordList',
  'reviewCount',
  'imagePathList',
  'type',
  'weeklyClosedDayList',
  'operatingHourList',
  'closedDayList',
  'breakTimeList',
]) {
  constructor(data: OwnedPlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: OwnedPlaceOverviewModel,
  ): OwnedPlaceOverviewEntity {
    return new OwnedPlaceOverviewEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      reviewCount: model.reviewCount,
      imagePathList: model.imgPathList,
      type: model.type,
      weeklyClosedDayList: model.weeklyClosedDayList,
      operatingHourList: model.operatingHourList,
      closedDayList: model.closedDayList,
      breakTimeList: model.breakTimeList,
    });
  }
}
