import { SelectReviewKeyword } from './prisma-type/select-review-keyword';

export class ReviewKeywordModel {
  public idx: number;
  public content: string;

  constructor(data: ReviewKeywordModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(keyword: SelectReviewKeyword): ReviewKeywordModel {
    return new ReviewKeywordModel({
      idx: keyword.idx,
      content: keyword.content,
    });
  }
}
