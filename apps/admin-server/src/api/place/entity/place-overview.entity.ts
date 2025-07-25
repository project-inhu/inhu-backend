import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceOverviewModel } from '@libs/core';
import { PlaceRoadAddressEntity } from './place-road-address.entity';
import { KeywordEntity } from '@admin/api/keyword/entity/keyword.entity';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'imagePathList',
  'type',
  'activatedAt',
  'permanentlyClosedAt',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceOverviewModel): PlaceOverviewEntity {
    return new PlaceOverviewEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      reviewCount: model.reviewCount,
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      imagePathList: model.imgPathList,
      type: model.type,
      activatedAt: model.activatedAt,
      permanentlyClosedAt: model.permanentlyClosedAt,
    });
  }
}
