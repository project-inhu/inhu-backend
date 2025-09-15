import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCouponTemplateEtcDto {
  /**
   * 쿠폰 이름
   *
   * @example "토핑 무료 쿠폰"
   */
  @IsNotEmpty()
  @IsString()
  name: string;
}
