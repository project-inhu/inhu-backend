import { PlaceOverviewEntity } from 'src/api/place/entity/place-overview.entity';
import { PickedPlaceSelectField } from '../type/picked-place-select-field';

export class PickedPlaceEntity {
  /**
   * title
   *
   * @example '깔끔한 분위기'
   */
  title: string;

  /**
   * content
   *
   * @example '후문 가까이에 위치해 있어 밥약하기 좋아요'
   */
  content: string;

  /**
   * 등록한 place 정보
   */
  place: PlaceOverviewEntity;

  constructor(data: PickedPlaceEntity) {
    Object.assign(this, data);
  }

  static createEntityFromPrisma(
    pickedPlace: PickedPlaceSelectField,
  ): PickedPlaceEntity {
    return new PickedPlaceEntity({
      title: pickedPlace.title,
      content: pickedPlace.content,
      place: PlaceOverviewEntity.createEntityFromPrisma(pickedPlace.place),
    });
  }
}
