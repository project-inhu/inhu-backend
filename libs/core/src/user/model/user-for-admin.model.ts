import { SelectUserForAdmin } from './prisma-type/select-user-for-admin';
import { UserProviderModel } from './user-provider.model';

/**
 * 사용자 정보 모델 (관리자용)
 *
 * @publicApi
 */
export class UserForAdminModel {
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
   * @example "/profile/image.jpg"
   */
  profileImagePath: string | null;

  /**
   * 권한 인증처
   */
  provider: UserProviderModel | null;

  /**
   * 사용자가 작성한 리뷰 개수
   *
   * @example 12
   */
  reviewCount: number;

  /**
   * 계정 생성일
   *
   * @example "2025-07-25T14:49:21.451Z"
   */
  createdAt: Date;

  constructor(data: UserForAdminModel) {
    Object.assign(this, data);
  }

  static fromPrisma(user: SelectUserForAdmin): UserForAdminModel {
    return new UserForAdminModel({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      provider: user.userProvider
        ? UserProviderModel.fromPrisma(user.userProvider)
        : null,
      reviewCount: user._count.reviewList,
      createdAt: user.createdAt,
    });
  }
}
