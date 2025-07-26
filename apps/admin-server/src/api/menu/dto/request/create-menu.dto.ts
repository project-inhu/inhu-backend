import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

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
  @ValidateIf((o) => o.content !== null)
  @IsString()
  content: string | null;

  /**
   * 메뉴 가격
   * @example 6500
   */
  @ValidateIf((o) => o.price !== null)
  @IsNumber()
  price: number | null;

  /**
   * 메뉴 이미지 경로
   * @example "/menu/a7b1cde2.jpg"
   */
  @ValidateIf((o) => o.imagePath !== null)
  @IsString()
  imagePath: string | null;

  /**
   * 가격 변동 가능 여부
   * @example false
   */
  @IsBoolean()
  isFlexible: boolean;
}
