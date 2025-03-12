import { ReviewEntity } from '../entity/review.entity';

/**
 * 특정 장소의 리뷰 목록을 조회한 후 반환되는 DTO
 *
 * @author 강정연
 */
export class GetReviewsByPlaceIdxResponseDto {
  /**
   * 특정 장소에 등록된 리뷰 목록
   */
  reviews: ReviewEntity[];
}
