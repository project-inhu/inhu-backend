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
   * @example "user123/profile.jpg"
   */
  profileImagePath: string | null;

  /**
   * 계정 생성일
   *
   * @example "2025-03-07T08:50:21.451Z"
   */
  createdAt: Date;

  /**
   * SNS ID
   *
   * @example "3906895819"
   */
  snsId?: string;

  /**
   * SNS provider
   *
   * @example "kakao"
   */
  provider?: string;

  constructor(data: UserModel) {
    Object.assign(this, data);
  }

  /**
   * Prisma 쿼리 결과를 UserEntity로 변환하는 메서드
   */
  static fromPrisma(user: SelectUser): UserModel {
    return new UserModel({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      snsId: user.userProvider?.snsId,
      provider: user.userProvider?.name,
    });
  }
}
