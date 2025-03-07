import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { User } from '@prisma/client';
import { exhaustMap } from 'rxjs';

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
  @ApiProperty({ description: '사용자 고유 idx', example: 1 })
  idx: number;

  @ApiProperty({ description: '사용자 닉네임', example: 'heeju' })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 경로',
    example: 'https://inhu.s3.ap-northeast-2.amazonaws.com/user123/profile.jpg',
    nullable: true,
  })
  profileImagePath: string | null;

  @ApiProperty({
    description: '계정 생성일',
    example: '2025-03-07T08:50:21.451Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '계정 삭제일',
    example: '2025-03-10T08:50:21.451Z',
    nullable: true,
  })
  deletedAt?: Date | null;

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
