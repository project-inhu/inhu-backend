import { CouponTemplatePlaceModel } from '@libs/core/coupon-template/model/coupon-template-place.model';

export class CouponTemplatePlaceEntity {
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
