import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetUserOverviewAllDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  public page: number;
}
