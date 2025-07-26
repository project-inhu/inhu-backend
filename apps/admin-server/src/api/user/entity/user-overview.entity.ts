import { UserForAdminModel, UserProviderModel } from '@libs/core';

export class UserOverviewEntity {
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

  constructor(data: UserOverviewEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserForAdminModel): UserOverviewEntity {
    return new UserOverviewEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
      provider: model.provider,
      reviewCount: model.reviewCount,
      createdAt: model.createdAt,
    });
  }
}
