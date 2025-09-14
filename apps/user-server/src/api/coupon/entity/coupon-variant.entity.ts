import { CouponVariantModel } from '@libs/core/coupon/model/coupon-variant.model';

export class CouponVariantEntity {
  /**
   * 쿠폰명
   *
   * @example '토핑 무료 쿠폰'
   */
  public name: string;

  constructor(data: CouponVariantEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponVariantModel): CouponVariantEntity {
    return new CouponVariantEntity({
      name: model.name,
    });
  }
}
