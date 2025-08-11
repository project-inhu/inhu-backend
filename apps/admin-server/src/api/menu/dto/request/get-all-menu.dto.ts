import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class GetAllMenuDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(500)
  public row: number;

  /**
   * 정렬 방향
   *
   * @example 'asc'
   * @default 'asc'
   */
  @IsOptional()
  @IsIn(['desc', 'asc'])
  order?: 'desc' | 'asc';
}
