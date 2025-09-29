import { CouponTemplateFixedDiscountModel } from '@libs/core/coupon-template/model/coupon-template-fixed-discount.model';

export class CouponTemplateFixedDiscountEntity {
  /**
   * 메뉴명
   *
   * @example '맥주'
   */
  public menuName: string;

  /**
   * 할인 금액
   *
   * @example 2000
   */
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
