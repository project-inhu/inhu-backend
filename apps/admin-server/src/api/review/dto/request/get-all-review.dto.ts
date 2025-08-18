import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GetAllReviewDto {
  /**
   * page number
   *
   * @example 1
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  /**
   * 장소 식별자
   * 해당 장소의 리뷰만 필터링
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  placeIdx?: number;

  /**
   * 사용자 식별자
   * 해당 유저가 작성한 리뷰만 필터링
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userIdx?: number;

  /**
   * 정렬 옵션
   *time = 시간순
   *
   * @example 'time'
   * @default 'time'
   */
  @IsOptional()
  @IsIn(['time'])
  orderBy?: 'time';

  /**
   * 정렬 방향
   *
   * @example 'desc'
   * @default 'desc'
   */
  @IsOptional()
  @IsIn(['desc', 'asc'])
  order?: 'desc' | 'asc';
}
