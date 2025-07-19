import { PickType } from '@nestjs/swagger';
import { UserEntity } from '@user/api/user/entity/user.entity';
import { ReviewAuthorModel } from '@libs/core/review/model/review-author.model';

export class ReviewAuthorEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
]) {
  constructor(data: ReviewAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(user: ReviewAuthorModel): ReviewAuthorEntity {
    return new ReviewAuthorEntity({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
    });
  }
}
