import { PickType } from '@nestjs/swagger';
import { PlaceModel } from '@libs/core/place/model/place.model';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';

export class ReviewPlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
]) {
  constructor(data: ReviewPlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(place: PlaceModel): ReviewPlaceEntity {
    return new ReviewPlaceEntity({
      idx: place.idx,
      name: place.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(place.roadAddress),
    });
  }
}
