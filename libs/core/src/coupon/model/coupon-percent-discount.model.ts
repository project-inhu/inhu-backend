import { SelectCouponPercentDiscount } from './prisma-type/select-coupon-percent-discount';

/**
 * 퍼센트 할인 쿠폰 모델
 *
 * @publicApi
 */
export class CouponPercentDiscountModel {
  public menuName: string;
  public percent: number;
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
