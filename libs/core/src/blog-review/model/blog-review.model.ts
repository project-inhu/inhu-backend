import { BlogReviewPlaceModel } from '@libs/core/blog-review/model/blog-review-place.model';
import { SelectBlogReview } from '@libs/core/blog-review/model/prisma-type/select-blog-review';

export class BlogReviewModel {
  public idx: number;
  public place: BlogReviewPlaceModel;
  public blogName: string;
  public title: string;
  public description: string | null;
  public contents: string | null;
  public authorName: string;
  public authorProfileImagePath: string | null;
  public thumbnailImagePath: string | null;
  public url: string;
  public blogType: 0;
  public createdAt: Date;
  public uploadedAt: Date;

  constructor(data: BlogReviewModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(blogReview: SelectBlogReview): BlogReviewModel {
    return new BlogReviewModel({
      idx: blogReview.idx,
      place: BlogReviewPlaceModel.fromPrisma(blogReview.place),
      blogName: blogReview.blogName,
      blogType: blogReview.blogType as 0,
      authorName: blogReview.authorName,
      authorProfileImagePath: blogReview.authorProfileImagePath,
      contents: blogReview.contents,
      description: blogReview.description,
      thumbnailImagePath: blogReview.thumbnailImagePath,
      title: blogReview.title,
      uploadedAt: blogReview.uploadedAt,
      url: blogReview.url,
      createdAt: blogReview.createdAt,
    });
  }
}
