import {
  User,
  UserProvider,
  Bookmark,
  Review,
  Service1Result,
  Service2Result,
  WithdrawServiceResult,
} from '@prisma/client';

/**
 * User 테이블 + UserProvider 테이블을 포함한 기본 엔티티
 *
 * @author 조희주
 */
export class UserEntity {
  /**
   * 사용자 고유 idx
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
   * 계정 삭제일 (삭제되지 않은 경우 null)
   *
   * @example "2025-03-10T08:50:21.451Z"
   */
  deletedAt?: Date | null;

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

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  /**
   * Prisma 쿼리 결과를 UserEntity로 변환하는 메서드
   */
  static createEntityFromPrisma(
    user: User & {
      userProvider?: UserProvider;
      bookmark?: Bookmark[];
      review?: Review[];
      service1Result?: Service1Result[];
      service2Result?: Service2Result[];
      withdrawServiceResult?: WithdrawServiceResult[];
    },
  ): UserEntity {
    return new UserEntity({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      snsId: user.userProvider?.snsId,
      provider: user.userProvider?.name,
    });
  }
}
