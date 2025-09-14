import { CouponPercentDiscountModel } from '@libs/core/coupon/model/coupon-percent-discount.model';

export class CouponPercentDiscountEntity {
  /**
   * 메뉴명
   *
   * @example '맥주'
   */
  public menuName: string;

  /**
   * 할인 퍼센트
   *
   * @example 10
   */
  public percent: number;

  /**
   * 최대 할인 금액
   *
   * @example 2000
   */
  public maxPrice: number | null;

  constructor(data: CouponPercentDiscountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponPercentDiscountModel: CouponPercentDiscountModel,
  ): CouponPercentDiscountEntity {
    return new CouponPercentDiscountEntity({
      menuName: couponPercentDiscountModel.menuName,
      percent: couponPercentDiscountModel.percent,
      maxPrice: couponPercentDiscountModel.maxPrice,
    });
  }
}
