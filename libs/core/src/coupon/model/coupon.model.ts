import { PickType } from '@nestjs/swagger';
import { CouponOwnModel } from './coupon-own.model';
import { CouponPercentDiscountModel } from './coupon-percent-discount.model';
import { CouponPriceDiscountModel } from './coupon-price-discount.model';
import { CouponTemplateModel } from './coupon-template.model';
import { SelectCoupon } from './prisma-type/select-coupon';
import { CouponPlaceModel } from './coupon-place.model';

/**
 * 쿠폰 모델
 *
 * @publicApi
 */
export class CouponModel extends PickType(CouponTemplateModel, [
  'id',
  'name',
  'description',
  'imagePath',
  'couponPlace',
]) {
  public bundleId: string;
  public createdAt: Date;
  public activatedAt: Date;
  public expiredAt: Date;
  public usedAt: Date | null;
  public couponPriceDiscount: CouponPriceDiscountModel | null;
  public couponPercentDiscount: CouponPercentDiscountModel | null;
  public couponOwnList: CouponOwnModel[];

  constructor(data: CouponModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(coupon: SelectCoupon): CouponModel {
    return new CouponModel({
      id: coupon.id,
      name: coupon.name,
      description: coupon.description,
      imagePath: coupon.imagePath,
      couponPlace: CouponPlaceModel.fromPrisma(coupon.place),
      bundleId: coupon.bundleId,
      createdAt: coupon.createdAt,
      activatedAt: coupon.activatedAt,
      expiredAt: coupon.expiredAt,
      usedAt: coupon.usedAt,
      couponPriceDiscount: CouponPriceDiscountModel.fromPrisma(
        coupon.couponPriceDiscount,
      ),
      couponPercentDiscount: CouponPercentDiscountModel.fromPrisma(
        coupon.couponPercentDiscount,
      ),
      couponOwnList: coupon.couponOwnList.map((own) =>
        CouponOwnModel.fromPrisma(own),
      ),
    });
  }
}
