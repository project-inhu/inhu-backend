import { SelectBlogReviewPlace } from '@libs/core/blog-review/model/prisma-type/select-blog-review-place';
import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';

export class BlogReviewPlaceModel extends PickType(PlaceModel, [
  'idx',
] as const) {
  constructor(data: BlogReviewPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectBlogReviewPlace): BlogReviewPlaceModel {
    return new BlogReviewPlaceModel({
      idx: place.idx,
    });
  }
}
