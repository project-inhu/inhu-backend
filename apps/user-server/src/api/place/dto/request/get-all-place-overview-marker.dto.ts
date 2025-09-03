import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class GetAllPlaceOverviewMarkerDto {
  /**
   * 정렬 옵션
   *
   * @example "time"
   */
  @IsOptional()
  @IsIn(['time', 'review'])
  orderby: 'time' | 'review' = 'time';

  /**
   * 정렬 방향
   *
   * @example "desc"
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
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
  @IsBoolean()
  operating?: boolean;

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 편의점
   */
  @IsOptional()
  @IsEnumValue(PlaceType)
  @Type(() => Number)
  type?: PlaceType;
}
