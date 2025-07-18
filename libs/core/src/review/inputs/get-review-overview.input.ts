export class GetReviewOverviewInput {
  take: number;
  skip: number;

  /**
   * 장소 식별자
   */
  placeIdx?: number;

  /**
   * 사용자 식별자
   */
  userIdx?: number;
}
