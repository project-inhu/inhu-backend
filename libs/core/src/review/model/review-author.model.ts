import { SelectReviewAuthor } from './prisma-type/select-review-author';

export class ReviewAuthorModel {
  public idx: number;
  public nickname: string;
  public profileImagePath: string | null;

  constructor(data: ReviewAuthorModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(user: SelectReviewAuthor): ReviewAuthorModel {
    return new ReviewAuthorModel({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
    });
  }
}
