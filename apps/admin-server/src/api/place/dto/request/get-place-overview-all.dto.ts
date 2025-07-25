import { ToBoolean } from '@libs/common';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetPlaceOverviewDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  public page: number;

  /**
   * 활성화 여부
   *
   * - true: 활성화된 장소만 조회
   * - false: 비활성화된 장소만 조회
   * - undefined: 모든 장소 조회
   */
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  public active?: boolean;
}
