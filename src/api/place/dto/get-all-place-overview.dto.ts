import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { PlaceOverviewOrderBy } from '../common/enums/place-overview-order-by.enum';

export class GetAllPlaceOverviewDto {
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
   * @example createdAtDesc
   */
  @IsOptional()
  @IsEnum(PlaceOverviewOrderBy)
  orderBy?: PlaceOverviewOrderBy;
}
