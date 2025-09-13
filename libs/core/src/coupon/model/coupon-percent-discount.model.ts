import { PickType } from '@nestjs/swagger';
import { CouponTemplatePercentDiscountModel } from './coupon-template-percent-discount.model';
import { SelectCouponPercentDiscount } from './prisma-type/select-coupon-percent-discount';

export class CouponPercentDiscountModel extends PickType(
  CouponTemplatePercentDiscountModel,
  ['percent', 'maxPrice'],
) {
  public idx: number;

  constructor(data: CouponPercentDiscountModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponPercentDiscount: SelectCouponPercentDiscount,
  ): CouponPercentDiscountModel {
    return new CouponPercentDiscountModel({
      idx: couponPercentDiscount.idx,
      percent: couponPercentDiscount.percent,
      maxPrice: couponPercentDiscount.maxPrice,
    });
  }
}
