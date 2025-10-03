import { PickType } from '@nestjs/swagger';
import { SelectReviewPlace } from './prisma-type/select-review-place';
import { PlaceModel } from '@libs/core/place/model/place.model';
import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

/**
 * 리뷰 장소 모델
 *
 * @publicApi
 */
export class ReviewPlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'roadAddress',
  'type',
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
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
    });
  }
}
