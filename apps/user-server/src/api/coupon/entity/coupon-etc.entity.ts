import { CouponEtcModel } from '@libs/core/coupon/model/coupon-etc.model';

export class CouponEtcEntity {
  /**
   * 쿠폰명
   *
   * @example '토핑 무료 쿠폰'
   */
  public name: string;

  constructor(data: CouponEtcEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponEtcModel): CouponEtcEntity {
    return new CouponEtcEntity({
      name: model.name,
    });
  }
}
