import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { ToBoolean } from '@app/common';
import { PlaceType } from '@app/core';

export class GetAllBookmarkedPlaceOverviewPlaceDto {
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
  type?: PlaceType;

  /**
   * 왼쪽 위 x좌표
   */
  @IsOptional()
  @IsDecimal()
  leftTopX?: number;

  /**
   * 왼쪽 위 y좌표
   */
  @IsOptional()
  @IsDecimal()
  leftTopY?: number;

  /**
   * 오른쪽 아래 x좌표
   */
  @IsOptional()
  @IsDecimal()
  rightBottomX?: number;

  /**
   * 오른쪽 아래 y좌표
   */
  @IsOptional()
  @IsDecimal()
  rightBottomY?: number;
}
