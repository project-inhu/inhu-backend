import { ReviewEntity } from '../../entity/review.entity';

export class GetAllReviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 리뷰 목록 data
   */
  reviewList: ReviewEntity[];
}
