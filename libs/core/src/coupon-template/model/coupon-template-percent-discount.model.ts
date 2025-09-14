import { SelectCouponTemplatePercentDiscount } from './prisma-type/select-coupon-template-percent-discount';

/**
 * 퍼센트 할인 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplatePercentDiscountModel {
  public menuName: string;
  public percent: number;
  public maxPrice: number | null;

  constructor(data: CouponTemplatePercentDiscountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplatePercentDiscount: SelectCouponTemplatePercentDiscount,
  ): CouponTemplatePercentDiscountModel {
    return new CouponTemplatePercentDiscountModel({
      menuName: couponTemplatePercentDiscount.menuName,
      percent: couponTemplatePercentDiscount.percent,
      maxPrice: couponTemplatePercentDiscount.maxPrice,
    });
  }
}
