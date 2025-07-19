import { UserProviderModel } from './user-provider.model';
import { SelectUser } from './prisma-type/select-user';

export class UserModel {
  /**
   * 사용자 식별자
   *
   * @example 1
   */
  idx: number;

  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/user123/profile.jpg"
   */
  profileImagePath: string | null;

  /**
   * 계정 생성일
   *
   * @example "2025-03-07T08:50:21.451Z"
   */
  createdAt: Date;

  /**
   * 권한 인증처
   */
  provider: UserProviderModel | null;

  constructor(data: UserModel) {
    Object.assign(this, data);
  }

  static fromPrisma(user: SelectUser): UserModel {
    return new UserModel({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      provider: user.userProvider
        ? UserProviderModel.fromPrisma(user.userProvider)
        : null,
    });
  }
}
