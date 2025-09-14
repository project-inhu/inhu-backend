import { CouponFixedDiscountModel } from '@libs/core/coupon/model/coupon-fixed-discount.model';

export class CouponFixedDiscountEntity {
  public menuName: string;
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
