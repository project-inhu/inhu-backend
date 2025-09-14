import { SelectCouponTemplateVariant } from './prisma-type/select-coupon-template-variant';

/**
 * 기타 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplateVariantModel {
  /**
   * 쿠폰명
   */
  public name: string;

  constructor(data: CouponTemplateVariantModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplateVariant: SelectCouponTemplateVariant,
  ): CouponTemplateVariantModel {
    return new CouponTemplateVariantModel({
      name: couponTemplateVariant.name,
    });
  }
}
