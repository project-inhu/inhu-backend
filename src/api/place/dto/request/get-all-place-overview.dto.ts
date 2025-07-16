import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ToBoolean } from 'src/common/decorator/to-boolean.decorator';

/**
 * GetAllPlaceOverview의 요청 DTO
 *
 * @author 강정연
 */
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
   * @default "time"
   * @example "time"
   */
  @IsOptional()
  orderby: 'time' | 'review' = 'time';

  /**
   * 정렬 방향
   *
   * @default "desc"
   * @example "desc"
   */
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';

  /**
   * 운영 중인 장소만 가져오기
   *
   * true: 운영 중인 장소만
   * false: 운영 중이지 않은 장소만
   * undefined: 운영 중인 장소와 운영 중이지 않은 장소 모두 가져오기
   */
  @IsOptional()
  @ToBoolean()
  operating?: boolean;
}
