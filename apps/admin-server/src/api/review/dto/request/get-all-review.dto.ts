export class GetAllReviewDto {
  /**
   * page number
   *
   * @example 1
   */
  page: number;

  /**
   * 삭제된 리뷰 포함 여부
   * @example true
   */
  includeDeleted?: boolean;

  /**
   * 리뷰 작성자 닉네임 기준 필터
   * @example 'gong_sil'
   */
  userNickname?: string;

  /**
   * 리뷰 작성된 장소 이름
   * @example '동아리 닭갈비'
   */
  placeName?: string;
}
