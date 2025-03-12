import { ReviewEntity } from '../entity/review.entity';

/**
 * 특정 장소에 리뷰를 생성한 후 반환되는 DTO
 *
 * @author 강정연
 */
export class CreateReviewByPlaceIdxResponseDto {
  /**
   * 특정 리뷰 idx의 데이터
   */
  review: ReviewEntity;
}
