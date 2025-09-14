import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCouponTemplateFixedDiscountDto {
  /**
   * 메뉴 이름
   *
   * @example "맥주"
   */
  @IsNotEmpty()
  @IsString()
  menuName: string;

  /**
   * 할인 금액
   *
   * @example 2000
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  price: number;
}
