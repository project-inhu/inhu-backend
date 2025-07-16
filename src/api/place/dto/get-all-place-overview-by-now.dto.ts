import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * GetAllPlaceOverviewByNow의 요청 DTO
 *
 * @author 강정연
 */
export class GetAllPlaceOverviewByNowDto {
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
}
