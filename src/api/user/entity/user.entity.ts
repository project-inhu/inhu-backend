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
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com/user123/profile.jpg"
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

  /**
   * 사용자의 북마크 목록
   *
   * @example [
   *   {
   *     "idx": 1,
   *     "userIdx": 1,
   *     "placeIdx": 5,
   *     "createdAt": "2025-03-10T08:50:21.451Z",
   *     "deletedAt": null
   *   }
   * ]
   */
  bookmarkList?: Bookmark[];

  /**
   * 사용자가 작성한 리뷰 목록
   *
   * @example [
   *   {
   *     "idx": 1,
   *     "userIdx": 1,
   *     "placeIdx": 5,
   *     "createdAt": "2025-03-10T08:50:21.451Z",
   *     "deletedAt": null
   *   }
   * ]
   */
  reviewList?: Review[];

  /**
   * Service1 결과 목록
   *
   * @example [
   *   {
   *     "idx": 1,
   *     "userIdx": 1,
   *     "service1Idx": 3,
   *     "content": "인후를 사용하면서 전반적인 서비스 경험이 좋았어요.",
   *     "createdAt": "2025-03-09T14:20:30.123Z"
   *   }
   * ]
   */
  service1ResultList?: Service1Result[];

  /**
   * Service2 결과 목록
   *
   * @example [
   *   {
   *     "idx": 2,
   *     "userIdx": 1,
   *     "service2Idx": 2,
   *     "content": "추가적인 서비스가 있으면 좋겠어요.",
   *     "createdAt": "2025-03-09T15:45:10.567Z"
   *   }
   * ]
   */
  service2ResultList?: Service2Result[];

  /**
   * 회원 탈퇴시에 진행하는 서비스 조사 결과 목록
   *
   * @example [
   *   {
   *     "idx": 1,
   *     "userIdx": 1,
   *     "withdrawServiceIdx": 4,
   *     "createdAt": "2025-03-11T10:00:00.000Z"
   *   }
   * ]
   */
  withdrawServiceResultList?: WithdrawServiceResult[];

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
      bookmarkList: user.bookmark,
      reviewList: user.review,
      service1ResultList: user.service1Result,
      service2ResultList: user.service2Result,
      withdrawServiceResultList: user.withdrawServiceResult,
    });
  }
}
