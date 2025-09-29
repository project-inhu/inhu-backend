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
import { CreateCouponEtcDto } from './create-coupon-etc.dto';

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
   * @example '2023-10-01T15:00:00Z'
   */
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  expiredAt: Date;

  /**
   * 고정 할인 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponFixedDiscountDto)
  fixedDiscount?: CreateCouponFixedDiscountDto;

  /**
   * 퍼센트 할인 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponPercentDiscountDto)
  percentDiscount?: CreateCouponPercentDiscountDto;

  /**
   * 기타 쿠폰 정보
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCouponEtcDto)
  etc?: CreateCouponEtcDto;

  /**
   * 발급 수량
   *
   * @example 1
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  count: number;
}
