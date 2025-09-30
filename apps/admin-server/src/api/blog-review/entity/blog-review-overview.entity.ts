import { BlogReviewOverviewModel } from '@libs/core/blog-review/model/blog-review-overview.model';
import { BlogReviewEntity } from '@admin/api/blog-review/entity/blog-review.entity';
import { PickType } from '@nestjs/swagger';

export class BlogReviewOverviewEntity extends PickType(BlogReviewEntity, [
  'idx',
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
  constructor(data: BlogReviewOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: BlogReviewOverviewModel,
  ): BlogReviewOverviewEntity {
    return new BlogReviewOverviewEntity({
      idx: model.idx,
      blogName: model.blogName,
      blogType: model.blogType as 0,
      authorName: model.authorName,
      authorProfileImagePath: model.authorProfileImagePath,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      title: model.title,
      uploadedAt: model.uploadedAt,
      url: model.url,
      createdAt: model.createdAt,
    });
  }
}
