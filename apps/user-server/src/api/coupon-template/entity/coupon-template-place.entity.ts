import { CouponTemplatePlaceModel } from '@libs/core/coupon-template/model/coupon-template-place.model';

export class CouponTemplatePlaceEntity {
  public idx: number;
  public name: string;

  constructor(data: CouponTemplatePlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplatePlace: CouponTemplatePlaceModel,
  ): CouponTemplatePlaceEntity {
    return new CouponTemplatePlaceEntity({
      idx: couponTemplatePlace.idx,
      name: couponTemplatePlace.name,
    });
  }
}
