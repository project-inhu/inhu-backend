import { CouponModel } from '@libs/core/coupon/model/coupon.model';
import { CouponFixedDiscountEntity } from './coupon-fixed-discount.entity';
import { CouponPercentDiscountEntity } from './coupon-percent-discount.entity';
import { CouponVariantEntity } from './coupon-variant.entity';
import { CouponPlaceEntity } from './coupon-place.entity';

export class CouponEntity {
  id: string;
  bundleId: string;
  description: string | null;
  imagePath: string | null;
  createdAt: Date;
  activatedAt: Date;
  expiredAt: Date;
  usedAt: Date | null;
  fixedDiscount: CouponFixedDiscountEntity | null;
  percentDiscount: CouponPercentDiscountEntity | null;
  variant: CouponVariantEntity | null;
  place: CouponPlaceEntity;

  constructor(data: CouponEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponModel): CouponEntity {
    return new CouponEntity({
      id: model.id,
      bundleId: model.bundleId,
      description: model.description,
      imagePath: model.imagePath,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      expiredAt: model.expiredAt,
      usedAt: model.usedAt,
      fixedDiscount: model.fixedDiscount
        ? CouponFixedDiscountEntity.fromModel(model.fixedDiscount)
        : null,
      percentDiscount: model.percentDiscount
        ? CouponPercentDiscountEntity.fromModel(model.percentDiscount)
        : null,
      variant: model.variant
        ? CouponVariantEntity.fromModel(model.variant)
        : null,
      place: CouponPlaceEntity.fromModel(model.place),
    });
  }
}
