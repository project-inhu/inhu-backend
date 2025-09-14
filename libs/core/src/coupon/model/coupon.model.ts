import { CouponPercentDiscountModel } from './coupon-percent-discount.model';
import { CouponFixedDiscountModel } from './coupon-fixed-discount.model';
import { SelectCoupon } from './prisma-type/select-coupon';
import { CouponPlaceModel } from './coupon-place.model';
import { CouponVariantModel } from './coupon-variant.model';

/**
 * 쿠폰 모델
 *
 * @publicApi
 */
export class CouponModel {
  public id: string;
  public bundleId: string;
  public description: string | null;
  public imagePath: string | null;
  public createdAt: Date;
  public activatedAt: Date;
  public expiredAt: Date;
  public usedAt: Date | null;
  public fixedDiscount: CouponFixedDiscountModel | null;
  public percentDiscount: CouponPercentDiscountModel | null;
  public variant: CouponVariantModel | null;
  public place: CouponPlaceModel;

  constructor(data: CouponModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(coupon: SelectCoupon): CouponModel {
    return new CouponModel({
      id: coupon.id,
      bundleId: coupon.bundleId,
      description: coupon.description,
      imagePath: coupon.imagePath,
      createdAt: coupon.createdAt,
      activatedAt: coupon.activatedAt,
      expiredAt: coupon.expiredAt,
      usedAt: coupon.usedAt,
      fixedDiscount: coupon.fixedDiscount
        ? CouponFixedDiscountModel.fromPrisma(coupon.fixedDiscount)
        : null,
      percentDiscount: coupon.percentDiscount
        ? CouponPercentDiscountModel.fromPrisma(coupon.percentDiscount)
        : null,
      variant: coupon.variant
        ? CouponVariantModel.fromPrisma(coupon.variant)
        : null,
      place: CouponPlaceModel.fromPrisma(coupon.place),
    });
  }
}
