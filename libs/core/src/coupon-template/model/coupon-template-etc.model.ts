import { SelectCouponTemplateEtc } from './prisma-type/select-coupon-template-etc';

/**
 * 기타 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplateEtcModel {
  /**
   * 쿠폰명
   */
  public name: string;

  constructor(data: CouponTemplateEtcModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplateEtc: SelectCouponTemplateEtc,
  ): CouponTemplateEtcModel {
    return new CouponTemplateEtcModel({
      name: couponTemplateEtc.name,
    });
  }
}
