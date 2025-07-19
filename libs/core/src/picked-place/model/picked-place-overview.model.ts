import { PickedPlaceModel } from './picked-place.model';
import { SelectPickedPlaceOverview } from './prisma-type/select-picked-place-overview';
import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';
import { PickType } from '@nestjs/swagger';

export class PickedPlaceOverviewModel extends PickType(PickedPlaceModel, [
  'idx',
  'title',
  'content',
]) {
  public place: PlaceOverviewModel;

  constructor(data: PickedPlaceOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromModel({
    place,
    ...pickedPlace
  }: SelectPickedPlaceOverview): PickedPlaceOverviewModel {
    return new PickedPlaceOverviewModel({
      idx: pickedPlace.idx,
      title: pickedPlace.title,
      content: pickedPlace.content,
      place: PlaceOverviewModel.fromPrisma(place),
    });
  }
}
