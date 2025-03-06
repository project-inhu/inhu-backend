import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { User } from '@prisma/client';

/**
 * 사용자 정보 엔티티
 *
 * @author 조희주
 */
export class UserInfoEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
  'createdAt',
  'deletedAt',
] as const) {
  constructor(partial: Partial<UserInfoEntity>) {
    super();
    Object.assign(this, partial);
  }

  /**
   * Prisma 쿼리 결과를 UserInfoEntity로 변환하는 메서드
   */
  static createEntityFromPrisma(user: User): UserInfoEntity {
    return new UserInfoEntity({
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    });
  }
}
