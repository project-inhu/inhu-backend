import { ToBoolean } from '@libs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  /**
   * 메뉴 이름
   * @example "아인슈페너"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 메뉴 설명
   * @example "부드러운 크림과 진한 에스프레소의 조화"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content: string | null = null;

  /**
   * 메뉴 가격
   * @example 6500
   */
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price: number | null = null;

  /**
   * 메뉴 이미지 경로
   * @example "/menu/a7b1cde2.jpg"
   */
  @IsOptional()
  @IsString()
  imagePath: string | null = null;

  /**
   * 가격 변동 가능 여부
   * @example false
   */
  @IsOptional()
  @ToBoolean()
  isFlexible: boolean;
}
