import { CouponVariantModel } from '@libs/core/coupon/model/coupon-variant.model';

export class CouponVariantEntity {
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
