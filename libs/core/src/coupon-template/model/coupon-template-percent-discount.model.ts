import { SelectCouponTemplatePercentDiscount } from './prisma-type/select-coupon-template-percent-discount';

/**
 * 퍼센트 할인 쿠폰 템플릿 모델
 *
 * @publicApi
 */
export class CouponTemplatePercentDiscountModel {
  /**
   * 메뉴명
   */
  public menuName: string;

  /**
   * 할인 퍼센트
   */
  public percent: number;

  /**
   * 최대 할인 금액
   */
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
