import { CouponTemplateEtcModel } from '@libs/core/coupon-template/model/coupon-template-etc.model';

export class CouponTemplateEtcEntity {
  /**
   * 쿠폰명
   *
   * @example '토핑 무료 쿠폰'
   */
  public name: string;

  constructor(data: CouponTemplateEtcEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplateEtc: CouponTemplateEtcModel,
  ): CouponTemplateEtcEntity {
    return new CouponTemplateEtcEntity({
      name: couponTemplateEtc.name,
    });
  }
}
