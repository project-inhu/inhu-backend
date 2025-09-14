import { CouponPlaceModel } from '@libs/core/coupon/model/coupon-place.model';

export class CouponPlaceEntity {
  /**
   * 쿠폰 사용처 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 쿠폰 사용처명
   *
   * @example '맥주집'
   */
  public name: string;

  constructor(data: CouponPlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponPlaceModel): CouponPlaceEntity {
    return new CouponPlaceEntity({
      idx: model.idx,
      name: model.name,
    });
  }
}
