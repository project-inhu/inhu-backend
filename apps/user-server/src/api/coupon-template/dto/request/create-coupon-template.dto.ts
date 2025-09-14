import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCouponTemplateFixedDiscountDto } from './create-coupon-template-fixed-discount.dto';
import { CreateCouponTemplatePercentDiscountDto } from './create-coupon-template-percent.dto';
import { CreateCouponTemplateVariantDto } from './create-coupon-template-variant.dto';
import { Trim } from '@user/common/decorator/trim.decorator';
import { Type } from 'class-transformer';

export class CreateCouponTemplateDto {
  /**
   * 쿠폰 추가 설명
   *
   * @example "2명 이상 방문 시 사용 가능"
   */
  @Trim()
  @IsOptional()
  @IsString()
  description: string | null;

  /**
   * 쿠폰 이미지 경로
   *
   * @example "/menu/00001.png"
   */
  @IsOptional()
  @IsString()
  imagePath: string | null;

  /**
   * 고정 할인 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponTemplateFixedDiscountDto)
  fixedDiscount?: CreateCouponTemplateFixedDiscountDto;

  /**
   * 퍼센트 할인 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponTemplatePercentDiscountDto)
  percentDiscount?: CreateCouponTemplatePercentDiscountDto;

  /**
   * 기타 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponTemplateVariantDto)
  variant?: CreateCouponTemplateVariantDto;
}
