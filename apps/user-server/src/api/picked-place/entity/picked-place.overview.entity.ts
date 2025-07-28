import { PickType } from '@nestjs/swagger';
import { PickedPlaceEntity } from './picked-place.entity';
import { PlaceOverviewEntity } from '@admin/api/place/entity/place-overview.entity';
import { PickedPlaceOverviewModel } from '@libs/core';

export class PickedPlaceOverviewEntity extends PickType(PickedPlaceEntity, [
  'idx',
  'title',
  'content',
]) {
  public place: PlaceOverviewEntity;

  constructor(data: PickedPlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PickedPlaceOverviewModel,
  ): PickedPlaceOverviewEntity {
    return new PickedPlaceOverviewEntity({
      idx: model.idx,
      title: model.title,
      content: model.content,
      place: PlaceOverviewEntity.fromModel(model.place),
    });
  }
}
