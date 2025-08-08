import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class GetPlaceOverviewDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1)
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
