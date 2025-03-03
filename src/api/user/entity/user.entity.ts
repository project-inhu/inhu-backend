import { Expose } from 'class-transformer';
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
  @Expose()
  idx: number;

  @Expose()
  nickname: string;

  @Expose()
  profileImagePath?: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  deletedAt?: Date | null;

  @Expose()
  snsId?: string;

  @Expose()
  provider?: string;

  @Expose()
  bookmark?: Bookmark[];

  @Expose()
  review?: Review[];

  @Expose()
  service1Result?: Service1Result[];

  @Expose()
  service2Result?: Service2Result[];

  @Expose()
  withdrawServiceResult?: WithdrawServiceResult[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
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
      bookmark: user.bookmark,
      review: user.review,
      service1Result: user.service1Result,
      service2Result: user.service2Result,
      withdrawServiceResult: user.withdrawServiceResult,
    });
  }
}
