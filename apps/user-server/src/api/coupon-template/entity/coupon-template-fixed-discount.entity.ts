import { CouponTemplateFixedDiscountModel } from '@libs/core/coupon-template/model/coupon-template-fixed-discount.model';

export class CouponTemplateFixedDiscountEntity {
  public menuName: string;
  public price: number;

  constructor(data: CouponTemplateFixedDiscountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplateFixedDiscount: CouponTemplateFixedDiscountModel,
  ): CouponTemplateFixedDiscountEntity {
    return new CouponTemplateFixedDiscountEntity({
      menuName: couponTemplateFixedDiscount.menuName,
      price: couponTemplateFixedDiscount.price,
    });
  }
}
