import { PickType } from '@nestjs/swagger';
import { SelectReviewAuthor } from './prisma-type/select-review-author';
import { UserModel } from '@libs/core/user/model/user.model';

export class ReviewAuthorModel extends PickType(UserModel, [
  'idx',
  'nickname',
  'profileImagePath',
]) {
  constructor(data: ReviewAuthorModel) {
    super();
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
