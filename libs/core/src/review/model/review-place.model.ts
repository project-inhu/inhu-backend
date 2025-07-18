import { SelectReviewPlace } from './prisma-type/select-review-place';

export class ReviewPlaceModel {
  public idx: number;
  public name: string;
  public addressName: string;
  public detailAddress: string | null;

  constructor(data: ReviewPlaceModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    place: SelectReviewPlace,
    placeIdx: number,
  ): ReviewPlaceModel {
    return new ReviewPlaceModel({
      idx: placeIdx,
      name: place.name,
      addressName: place.roadAddress.addressName,
      detailAddress: place.roadAddress.detailAddress,
    });
  }
}
