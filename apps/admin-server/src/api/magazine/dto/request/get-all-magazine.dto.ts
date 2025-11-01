import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

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
   * 활성화 중인 장소만 가져오기
   *
   * true: 활성화 중인 장소만
   * false: 활성화 중이지 않은 장소만
   * undefined: 활성화 중인 장소와 활성화 중이지 않은 장소 모두 가져오기
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  activated?: boolean;

  /**
   * 고정된 매거진만 조회 여부
   *
   * - true: 고정된 매거진만
   * - false: 고정되지 않은 매거진만
   * - undefined: 전체 매거진 (고정된 매거진 먼저 조회 후 고정되지 않은 매거진 조회. 고정된 매거진은 고정날짜 내림차순)
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  pinned?: boolean;
}
