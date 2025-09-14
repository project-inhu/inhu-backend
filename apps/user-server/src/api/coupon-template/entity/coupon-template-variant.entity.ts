import { CouponTemplateVariantModel } from '@libs/core/coupon-template/model/coupon-template-variant.model';

export class CouponTemplateVariantEntity {
  /**
   * 쿠폰명
   *
   * @example '토핑 무료 쿠폰'
   */
  public name: string;

  constructor(data: CouponTemplateVariantEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplateVariant: CouponTemplateVariantModel,
  ): CouponTemplateVariantEntity {
    return new CouponTemplateVariantEntity({
      name: couponTemplateVariant.name,
    });
  }
}
