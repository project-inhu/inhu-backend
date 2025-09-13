import { SelectCouponTemplatePriceDiscount } from './prisma-type/select-coupon-template-price-discount';

export class CouponTemplatePriceDiscountModel {
  public price: number;

  constructor(data: CouponTemplatePriceDiscountModel) {
    Object.assign(this, data);
  }

  public static fromData(
    data: SelectCouponTemplatePriceDiscount,
  ): CouponTemplatePriceDiscountModel {
    return new CouponTemplatePriceDiscountModel({
      price: data.price,
    });
  }
}
