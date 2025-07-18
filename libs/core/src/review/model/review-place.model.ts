import { PickType } from '@nestjs/swagger';
import { SelectReviewPlace } from './prisma-type/select-review-place';
import { PlaceModel } from '@app/core/place/model/place.model';
import { PlaceRoadAddressModel } from '@app/core/place/model/place-road-address.model';

export class ReviewPlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'roadAddress',
]) {
  constructor(data: ReviewPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectReviewPlace): ReviewPlaceModel {
    return new ReviewPlaceModel({
      idx: place.idx,
      name: place.name,
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
    });
  }
}
