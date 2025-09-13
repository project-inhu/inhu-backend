import { CouponPlaceModel } from './coupon-place.model';
import { SelectCouponTemplate } from './prisma-type/select-coupon-template';

export class CouponTemplateModel {
  public id: string;
  public name: string;
  public description: string | null;
  public imagePath: string | null;
  public couponPlace: CouponPlaceModel;

  constructor(data: CouponTemplateModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplate: SelectCouponTemplate,
  ): CouponTemplateModel {
    return new CouponTemplateModel({
      id: couponTemplate.id,
      name: couponTemplate.name,
      description: couponTemplate.description,
      imagePath: couponTemplate.imagePath,
      couponPlace: CouponPlaceModel.fromPrisma(couponTemplate.place),
    });
  }
}
