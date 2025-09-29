import { BlogReviewModel } from '@libs/core/blog-review/model/blog-review.model';

export class BlogReviewEntity {
  public idx: number;
  public blogName: string;
  public title: string;
  public description: string | null;
  public contents: string | null;
  public authorName: string;
  public authorProfileImagePath: string | null;
  public thumbnailImagePath: string | null;
  public url: string;
  public blogType: number;
  public createdAt: Date;
  public uploadedAt: Date;

  constructor(data: BlogReviewEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: BlogReviewModel): BlogReviewEntity {
    return new BlogReviewEntity({
      idx: model.idx,
      blogName: model.blogName,
      blogType: model.blogType as 0,
      authorName: model.authorName,
      authorProfileImagePath: model.authorProfileImagePath,
      contents: model.contents,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      title: model.title,
      uploadedAt: model.uploadedAt,
      url: model.url,
      createdAt: model.createdAt,
    });
  }
}
