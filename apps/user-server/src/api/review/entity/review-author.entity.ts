import { PickType } from '@nestjs/swagger';
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

  public static fromModel(user: UserModel): ReviewAuthorModel {
    return new ReviewAuthorModel({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
    });
  }
}
