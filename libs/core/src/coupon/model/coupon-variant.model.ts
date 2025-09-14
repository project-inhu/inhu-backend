import { SelectCouponVariant } from './prisma-type/select-coupon-variant';

/**
 * 기타 쿠폰 모델
 *
 * @publicApi
 */
export class CouponVariantModel {
  /**
   * 쿠폰명
   */
  public name: string;

  constructor(data: CouponVariantModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponVariant: SelectCouponVariant,
  ): CouponVariantModel {
    return new CouponVariantModel({
      name: couponVariant.name,
    });
  }
}
