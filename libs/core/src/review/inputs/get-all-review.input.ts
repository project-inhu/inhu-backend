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
   * 정렬 옵션
   *
   * time = 시간순
   */
  orderBy?: 'time';

  /**
   * 정렬 방향
   */
  order?: 'desc' | 'asc';
}
