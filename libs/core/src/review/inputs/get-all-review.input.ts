export class GetAllReviewInput {
  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;

  /**
   * 장소 식별자
   * 해당 장소의 리뷰만 필터링
   */
  placeIdx?: number;

  /**
   * 사용자 식별자
   * 해당 유저가 작성한 리뷰만 필터링
   */
  userIdx?: number;

  /**
   * 삭제된 리뷰 포함 여부
   * - 관리자용 API에서만 사용됨
   */
  includeDeleted?: boolean;

  /**
   * 리뷰 작성자 닉네임 기준 필터
   * - 관리자용 API에서만 사용됨
   */
  userNickname?: string;

  /**
   * 리뷰 작성된 장소 이름
   * - 관리자용 API에서만 사용됨
   */
  placeName?: string;
}
