import { PickType } from '@nestjs/swagger';
import { UserModel } from '@libs/core/user/model/user.model';
import { UserEntity } from '@user/api/user/entity/user.entity';

export class ReviewAuthorEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
]) {
  constructor(data: ReviewAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(user: UserModel): ReviewAuthorEntity {
    return new ReviewAuthorEntity({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
    });
  }
}
