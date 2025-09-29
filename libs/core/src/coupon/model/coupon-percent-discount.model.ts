import { SelectCouponPercentDiscount } from './prisma-type/select-coupon-percent-discount';

/**
 * 퍼센트 할인 쿠폰 모델
 *
 * @publicApi
 */
export class CouponPercentDiscountModel {
  /**
   * 메뉴명
   */
  public menuName: string;

  /**
   * 할인 퍼센트
   */
  public percent: number;

  /**
   * 최대 할인 금액
   */
  public maxPrice: number | null;

  constructor(data: CouponPercentDiscountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponPercentDiscount: SelectCouponPercentDiscount,
  ): CouponPercentDiscountModel {
    return new CouponPercentDiscountModel({
      menuName: couponPercentDiscount.menuName,
      percent: couponPercentDiscount.percent,
      maxPrice: couponPercentDiscount.maxPrice,
    });
  }
}
