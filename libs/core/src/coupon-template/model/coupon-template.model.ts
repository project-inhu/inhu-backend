import { CouponPlaceModel } from '../../coupon/model/coupon-place.model';
import { CouponTemplateFixedDiscountModel } from './coupon-template-fixed-discount.model';
import { CouponTemplatePercentDiscountModel } from './coupon-template-percent-discount.model';
import { CouponTemplateVariantModel } from './coupon-template-variant.model';
import { SelectCouponTemplate } from './prisma-type/select-coupon-template';

/**
 * 쿠폰 템플릿 모델 클래스
 *
 * @publicApi
 */
export class CouponTemplateModel {
  public id: string;
  public description: string | null;
  public imagePath: string | null;
  public fixedDiscount: CouponTemplateFixedDiscountModel | null;
  public percentDiscount: CouponTemplatePercentDiscountModel | null;
  public variant: CouponTemplateVariantModel | null;
  public place: CouponPlaceModel;

  constructor(data: CouponTemplateModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    couponTemplate: SelectCouponTemplate,
  ): CouponTemplateModel {
    return new CouponTemplateModel({
      id: couponTemplate.id,
      description: couponTemplate.description,
      imagePath: couponTemplate.imagePath,
      fixedDiscount: couponTemplate.fixedDiscount
        ? CouponTemplateFixedDiscountModel.fromPrisma(
            couponTemplate.fixedDiscount,
          )
        : null,
      percentDiscount: couponTemplate.percentDiscount
        ? CouponTemplatePercentDiscountModel.fromPrisma(
            couponTemplate.percentDiscount,
          )
        : null,
      variant: couponTemplate.variant
        ? CouponTemplateVariantModel.fromPrisma(couponTemplate.variant)
        : null,
      place: CouponPlaceModel.fromPrisma(couponTemplate.place),
    });
  }
}
