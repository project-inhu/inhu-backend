import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';
import { SelectCouponPlace } from './prisma-type/select-coupon-place';

export class CouponPlaceModel extends PickType(PlaceModel, ['idx', 'name']) {
  constructor(data: CouponPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectCouponPlace): CouponPlaceModel {
    return new CouponPlaceModel({
      idx: place.idx,
      name: place.name,
    });
  }
}
