import { ApiProperty } from '@nestjs/swagger';
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
    description: '계정 삭제일 (삭제되지 않은 경우 null)',
    example: '2025-03-10T08:50:21.451Z',
    nullable: true,
  })
  deletedAt?: Date | null;

  @ApiProperty({ description: 'SNS ID', example: '3906895819', nullable: true })
  snsId?: string;

  @ApiProperty({ description: 'SNS 제공자', example: 'kakao', nullable: true })
  provider?: string;

  @ApiProperty({
    description: '사용자의 북마크 목록',
    type: () => Object,
    isArray: true,
    nullable: true,
  })
  bookmark?: Bookmark[];

  @ApiProperty({
    description: '사용자가 작성한 리뷰 목록',
    type: () => Object,
    isArray: true,
    nullable: true,
  })
  review?: Review[];

  @ApiProperty({
    description: 'Service1 결과 목록',
    type: () => Object,
    isArray: true,
    nullable: true,
  })
  service1Result?: Service1Result[];

  @ApiProperty({
    description: 'Service2 결과 목록',
    type: () => Object,
    isArray: true,
    nullable: true,
  })
  service2Result?: Service2Result[];

  @ApiProperty({
    description: '회원 탈퇴시에 진행하는 서비스 조사 결과 목록',
    type: () => Object,
    isArray: true,
    nullable: true,
  })
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
