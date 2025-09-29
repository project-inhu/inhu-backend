import { CouponTemplatePercentDiscountModel } from '@libs/core/coupon-template/model/coupon-template-percent-discount.model';

export class CouponTemplatePercentDiscountEntity {
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
