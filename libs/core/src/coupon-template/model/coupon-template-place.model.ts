import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';
import { SelectCouponTemplatePlace } from './prisma-type/select-coupon-template-place';

/**
 * 쿠폰 템플릿 사용처 모델
 *
 * @publicApi
 */
export class CouponTemplatePlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
]) {
  constructor(data: CouponTemplatePlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    place: SelectCouponTemplatePlace,
  ): CouponTemplatePlaceModel {
    return new CouponTemplatePlaceModel({
      idx: place.idx,
      name: place.name,
    });
  }
}
