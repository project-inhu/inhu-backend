import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export const WEEKS = {
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun',
} as const;

class MenuDto {
  /**
   * 메뉴의 이름
   * @example "아이스 아메리카노"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 메뉴의 가격
   * @example 4500
   */
  @IsNumber()
  @IsOptional()
  price?: number;

  /**
   * 가격 유동 여부 (싯가 등)
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isflexible?: boolean;

  /**
   * 메뉴에 대한 간단한 설명
   * @example "신선한 원두로 내린 시원한 커피"
   */
  @MaxLength(50)
  @IsString()
  @IsOptional()
  content?: string;

  /**
   * 메뉴 이미지의 경로
   * @example "/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg"
   */
  @IsString()
  @IsOptional()
  imagePath?: string;
}

class BreakTimeDto {
  /**
   * 브레이크타임 시작 시간
   *
   * @example '12:00:00'
   */
  @IsString()
  @IsNotEmpty()
  startAt: string;

  /**
   * 브레이크타임 종료 시간
   *
   * @example '13:00:00'
   */
  @IsString()
  @IsNotEmpty()
  endAt: string;
}

class OperatingHourDto {
  /**
   * 영업시간 시작 시간
   *
   * @example '09:00:00'
   */
  @IsString()
  @IsNotEmpty()
  startAt: string;

  /**
   * 영업시간 종료 시간
   *
   * @example '22:00:00'
   */
  @IsString()
  @IsNotEmpty()
  endAt: string;

  /**
   * 브레이크 타임 정보
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakTimeDto)
  @IsOptional()
  breakTimeList?: BreakTimeDto[];
}

class OperatingDayDto {
  /**
   * 요일
   * @example "mon"
   */
  @IsIn(Object.values(WEEKS))
  @IsString()
  @IsNotEmpty()
  day: string;

  /**
   * 해당 요일의 영업 시간 목록
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHourDto)
  @IsOptional()
  operatingHourList?: OperatingHourDto[];
}

export class CreatePlaceDto {
  /**
   * 장소 이미지 목록
   *
   * @example ['place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg', 'place/12345678-1234-5678-1234-123456789012_20240706_124512.jpg']
   */
  @ArrayMaxSize(5)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageList?: string[];

  /**
   * place name
   *
   * @example '동아리 닭갈비'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 도로명 주소
   *
   * @example '인천 미추홀구 인하로 123'
   */
  @IsString()
  @IsNotEmpty()
  addressName: string;

  /**
   * 상세 주소
   *
   * @example '비룡플라자 1층'
   */
  @IsString()
  @IsOptional()
  detailAddress?: string;

  /**
   * place tel
   *
   * @example '032-1111-2222'
   */
  @IsString()
  @IsOptional()
  tel?: string;

  /**
   * 요일별 운영 시간 및 브레이크타임 정보
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingDayDto)
  operatingDayList: OperatingDayDto[];

  /**
   * 메뉴 목록
   */

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuDto)
  menuList: MenuDto[];
}
