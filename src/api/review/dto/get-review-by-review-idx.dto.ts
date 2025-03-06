import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * 특정 리뷰 Idx로 리뷰를 조회할 때 사용하는 DTO
 *
 * @author 강정연
 */
export class getReviewByReviewIdxDto {
  /**
   * 조회할 리뷰 Idx
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  reviewIdx: number;
}
