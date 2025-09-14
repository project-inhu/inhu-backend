import { CouponTemplatePercentDiscountModel } from '@libs/core/coupon-template/model/coupon-template-percent-discount.model';

export class CouponTemplatePercentDiscountEntity {
  public menuName: string;
  public percent: number;
  public maxPrice: number | null;

  constructor(data: CouponTemplatePercentDiscountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplatePercentDiscount: CouponTemplatePercentDiscountModel,
  ): CouponTemplatePercentDiscountEntity {
    return new CouponTemplatePercentDiscountEntity({
      menuName: couponTemplatePercentDiscount.menuName,
      percent: couponTemplatePercentDiscount.percent,
      maxPrice: couponTemplatePercentDiscount.maxPrice,
    });
  }
}
