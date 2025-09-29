import { CouponFixedDiscountModel } from '@libs/core/coupon/model/coupon-fixed-discount.model';

export class CouponFixedDiscountEntity {
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

  constructor(data: CouponFixedDiscountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: CouponFixedDiscountModel,
  ): CouponFixedDiscountEntity {
    return new CouponFixedDiscountEntity({
      menuName: model.menuName,
      price: model.price,
    });
  }
}
