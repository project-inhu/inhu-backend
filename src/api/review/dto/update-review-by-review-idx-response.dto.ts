import { ReviewEntity } from '../entity/review.entity';

/**
 * 특정 idx의 리뷰를 수정 후 반환되는 DTO
 *
 * @author 강정연
 */
export class UpdateReviewByReviewIdxResponseDto {
  /**
   * 특정 idx의 리뷰 데이터터
   */
  review: ReviewEntity;
}
