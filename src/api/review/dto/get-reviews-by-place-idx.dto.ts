import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * 특정 장소의 리뷰 목록을 조회할 때 사용하는 DTO
 *
 * @author 강정연
 */
export class GetReviewsByPlaceIdxDto {
  /**
   * 조회할 장소 Idx
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  placeIdx: number;
}
