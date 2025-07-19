import { SelectPickedPlace } from '@libs/core/picked-place/model/prisma-type/select-picked-place';
import { PlaceModel } from '@libs/core/place/model/place.model';

export class PickedPlaceModel {
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

  public place: PlaceModel;

  constructor(data: PickedPlaceModel) {
    Object.assign(this, data);
  }

  public static fromModel({
    place,
    ...pickedPlace
  }: SelectPickedPlace): PickedPlaceModel {
    return new PickedPlaceModel({
      idx: pickedPlace.idx,
      title: pickedPlace.title,
      content: pickedPlace.content,
      place: PlaceModel.fromPrisma(place),
    });
  }
}
