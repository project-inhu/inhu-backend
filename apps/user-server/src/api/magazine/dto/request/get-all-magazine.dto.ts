import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GetAllMagazineDto {
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
   * 정렬 옵션
   *
   * @example "time"
   */
  @IsOptional()
  @IsIn(['like', 'view', 'time'])
  orderBy: 'like' | 'view' | 'time' = 'like';
}
