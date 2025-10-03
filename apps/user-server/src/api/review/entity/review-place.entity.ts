import { PickType } from '@nestjs/swagger';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { ReviewPlaceModel } from '@libs/core/review/model/review-place.model';

export class ReviewPlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'type',
]) {
  constructor(data: ReviewPlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(place: ReviewPlaceModel): ReviewPlaceEntity {
    return new ReviewPlaceEntity({
      idx: place.idx,
      name: place.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(place.roadAddress),
      type: place.type,
    });
  }
}
