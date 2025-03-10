import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ReviewEntity } from '../entity/review.entity';
import { Type } from 'class-transformer';

/**
 * 특정 리뷰 Idx로 조회한 리뷰 데이터를 반환하는 DTO
 *
 * @author 강정연
 */
export class GetReviewByReviewIdxResponseDto {
  /**
   * 특정 리뷰 idx의 데이터
   */
  @ValidateNested()
  @Type(() => ReviewEntity)
  @IsNotEmpty()
  review: ReviewEntity;
}
