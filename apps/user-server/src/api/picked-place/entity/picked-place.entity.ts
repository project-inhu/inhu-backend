import { PlaceEntity } from '../../place/entity/place.entity';
import { PickedPlaceModel } from '@libs/core';

export class PickedPlaceEntity {
  /**
   * picked idx 식별자
   */
  public idx: number;

  /**
   * 제목
   */
  public title: string;

  /**
   * 내용
   */
  public content: string;

  /**
   * 장소 정보
   */
  public place: PlaceEntity;

  constructor(data: PickedPlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PickedPlaceModel,
    bookmark: boolean,
  ): PickedPlaceEntity {
    return new PickedPlaceEntity({
      idx: model.idx,
      title: model.title,
      content: model.content,
      place: PlaceEntity.fromModel(model.place, bookmark),
    });
  }
}
