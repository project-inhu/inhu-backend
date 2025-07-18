import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { PickedPlaceSelectField } from '../type/picked-place-select-field';

/**
 * picked place entity
 *
 * @author 강정연
 */
export class PickedPlaceEntity extends PlaceEntity {
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

  constructor(data: PickedPlaceEntity) {
    super(data);
    this.title = data.title;
    this.content = data.content;
  }

  static createEntity(data: PickedPlaceSelectField): PickedPlaceEntity {
    const place = PlaceEntity.createEntityFromPrisma(data.place);
    return new PickedPlaceEntity({
      title: data.title,
      content: data.content,
      ...place,
    });
  }
}
