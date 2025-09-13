import { PickType } from '@nestjs/swagger';
import { CouponTemplatePriceDiscountModel } from './coupon-template-price-discount.model';
import { SelectCouponPriceDiscount } from './prisma-type/select-coupon-price-discount';

export class CouponPriceDiscountModel extends PickType(
  CouponTemplatePriceDiscountModel,
  ['price'],
) {
  public idx: number;

  constructor(data: CouponPriceDiscountModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponPriceDiscount: SelectCouponPriceDiscount,
  ): CouponPriceDiscountModel {
    return new CouponPriceDiscountModel({
      idx: couponPriceDiscount.idx,
      price: couponPriceDiscount.price,
    });
  }
}
