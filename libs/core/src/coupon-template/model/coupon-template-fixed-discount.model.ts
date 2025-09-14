import { SelectCouponTemplateFixedDiscount } from './prisma-type/select-coupon-template-fixed-discount';

/**
 * 고정 할인 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplateFixedDiscountModel {
  public menuName: string;
  public price: number;

  constructor(data: CouponTemplateFixedDiscountModel) {
    Object.assign(this, data);
  }

  public static fromData(
    couponTemplateFixedDiscount: SelectCouponTemplateFixedDiscount,
  ): CouponTemplateFixedDiscountModel {
    return new CouponTemplateFixedDiscountModel({
      menuName: couponTemplateFixedDiscount.menuName,
      price: couponTemplateFixedDiscount.price,
    });
  }
}
