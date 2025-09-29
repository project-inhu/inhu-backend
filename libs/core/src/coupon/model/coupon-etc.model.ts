import { SelectCouponEtc } from './prisma-type/select-coupon-etc';

/**
 * 기타 쿠폰 모델
 *
 * @publicApi
 */
export class CouponEtcModel {
  /**
   * 쿠폰명
   */
  public name: string;

  constructor(data: CouponEtcModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(couponEtc: SelectCouponEtc): CouponEtcModel {
    return new CouponEtcModel({
      name: couponEtc.name,
    });
  }
}
