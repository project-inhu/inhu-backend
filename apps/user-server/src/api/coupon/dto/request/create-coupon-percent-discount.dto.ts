import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCouponPercentDiscountDto {
  /**
   * 메뉴 이름
   *
   * @example "맥주"
   */
  @IsNotEmpty()
  @IsString()
  menuName: string;

  /**
   * 할인 퍼센트
   *
   * @example 10
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  percent: number;

  /**
   * 최대 할인 금액
   *
   * @example 2000
   */
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPrice: number | null;
}
