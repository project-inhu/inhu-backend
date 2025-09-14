import { SelectCouponFixedDiscount } from './prisma-type/select-coupon-fixed-discount';

/**
 * 고정 할인 쿠폰 모델
 *
 * @publicApi
 */
export class CouponFixedDiscountModel {
  /**
   * 메뉴명
   */
  public menuName: string;

  /**
   * 할인 금액
   */
  public price: number;

  constructor(data: CouponFixedDiscountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponFixedDiscount: SelectCouponFixedDiscount,
  ): CouponFixedDiscountModel {
    return new CouponFixedDiscountModel({
      menuName: couponFixedDiscount.menuName,
      price: couponFixedDiscount.price,
    });
  }
}
