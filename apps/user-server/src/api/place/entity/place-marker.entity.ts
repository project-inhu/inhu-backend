import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceMarkerModel } from '@libs/core/place/model/place-marker.model';

export class PlaceMarkerEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'bookmark',
  'imagePathList',
  'type',
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
    });
  }
}
