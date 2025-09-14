import { CouponPlaceModel } from '@libs/core/coupon/model/coupon-place.model';

export class CouponPlaceEntity {
  public idx: number;
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
