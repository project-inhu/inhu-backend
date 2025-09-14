import { CouponPercentDiscountModel } from '@libs/core/coupon/model/coupon-percent-discount.model';

export class CouponPercentDiscountEntity {
  public menuName: string;
  public percent: number;
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
