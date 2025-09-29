import { SelectCouponTemplateFixedDiscount } from './prisma-type/select-coupon-template-fixed-discount';

/**
 * 고정 할인 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplateFixedDiscountModel {
  /**
   * 메뉴명
   */
  public menuName: string;

  /**
   * 할인 금액
   */
  public price: number;

  constructor(data: CouponTemplateFixedDiscountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplateFixedDiscount: SelectCouponTemplateFixedDiscount,
  ): CouponTemplateFixedDiscountModel {
    return new CouponTemplateFixedDiscountModel({
      menuName: couponTemplateFixedDiscount.menuName,
      price: couponTemplateFixedDiscount.price,
    });
  }
}
