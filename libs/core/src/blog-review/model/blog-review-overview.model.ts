import { BlogReviewPlaceModel } from '@libs/core/blog-review/model/blog-review-place.model';
import { BlogReviewModel } from '@libs/core/blog-review/model/blog-review.model';
import { SelectBlogReviewOverview } from '@libs/core/blog-review/model/prisma-type/select-blog-review-overview';
import { PickType } from '@nestjs/swagger';

export class BlogReviewOverviewModel extends PickType(BlogReviewModel, [
  'idx',
  'place',
  'blogName',
  'title',
  'description',
  'authorName',
  'authorProfileImagePath',
  'thumbnailImagePath',
  'url',
  'blogType',
  'createdAt',
  'uploadedAt',
] as const) {
  constructor(data: BlogReviewOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    blogReview: SelectBlogReviewOverview,
  ): BlogReviewOverviewModel {
    return new BlogReviewOverviewModel({
      idx: blogReview.idx,
      place: BlogReviewPlaceModel.fromPrisma(blogReview.place),
      blogName: blogReview.blogName,
      blogType: blogReview.blogType as 0,
      authorName: blogReview.authorName,
      authorProfileImagePath: blogReview.authorProfileImagePath,
      description: blogReview.description,
      thumbnailImagePath: blogReview.thumbnailImagePath,
      title: blogReview.title,
      uploadedAt: blogReview.uploadedAt,
      url: blogReview.url,
      createdAt: blogReview.createdAt,
    });
  }
}
