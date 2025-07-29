import { PickType } from '@nestjs/swagger';
import { UserOverviewEntity } from '@admin/api/user/entity/user-overview.entity';
import { ReviewAuthorModel } from '@libs/core/review/model/review-author.model';

export class ReviewAuthorEntity extends PickType(UserOverviewEntity, [
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
