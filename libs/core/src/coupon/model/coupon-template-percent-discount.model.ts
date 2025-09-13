import { SelectCouponTemplatePercentDiscount } from './prisma-type/select-coupon-template-percent-discount';

export class CouponTemplatePercentDiscountModel {
  public percent: number;
  public maxPrice: number | null;

  constructor(data: CouponTemplatePercentDiscountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplatePercentDiscount: SelectCouponTemplatePercentDiscount,
  ): CouponTemplatePercentDiscountModel {
    return new CouponTemplatePercentDiscountModel({
      percent: couponTemplatePercentDiscount.percent,
      maxPrice: couponTemplatePercentDiscount.maxPrice,
    });
  }
}
