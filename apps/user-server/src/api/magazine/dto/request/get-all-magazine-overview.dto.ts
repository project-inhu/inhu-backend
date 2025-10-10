import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetAllMagazineOverviewDto {
  /**
   * 가져올 매거진 개수
   *
   * @example 1
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  take: number;
}
