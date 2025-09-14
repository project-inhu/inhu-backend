import { Trim } from '@user/common/decorator/trim.decorator';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCouponFixedDiscountDto } from './create-coupon-fixed-discount.dto';
import { Type } from 'class-transformer';
import { CreateCouponPercentDiscountDto } from './create-coupon-percent-discount.dto';
import { CreateCouponVariantDto } from './create-coupon-variant.dto';

export class CreateCouponDto {
  /**
   * 쿠폰 추가 설명
   *
   * @example '2인 이상 방문 시 사용 가능'
   */
  @Trim()
  @IsOptional()
  @IsString()
  description: string | null;

  /**
   * 쿠폰 이미지 경로
   *
   * @example '/menu/00001.png'
   */
  @IsOptional()
  @IsString()
  imagePath: string | null;

  /**
   * 쿠폰 만료일
   *
   * @example '2024-12-31T23:59:59.000Z'
   */
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  expiredAt: Date;

  /**
   * 고정 할인 쿠폰 정보
   *
   * @example 'null'
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponFixedDiscountDto)
  fixedDiscount?: CreateCouponFixedDiscountDto;

  /**
   * 퍼센트 할인 쿠폰 정보
   *
   * @example 'null'
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponPercentDiscountDto)
  percentDiscount?: CreateCouponPercentDiscountDto;

  /**
   * 기타 쿠폰 정보
   *
   * @example { name: '토핑 무료 쿠폰' }
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponVariantDto)
  variant?: CreateCouponVariantDto;

  /**
   * 발급 수량
   *
   * @example 100
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  count: number;
}
