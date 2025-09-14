import { CouponTemplateModel } from '@libs/core/coupon-template/model/coupon-template.model';
import { CouponTemplatePlaceEntity } from './coupon-template-place.entity';
import { CouponTemplateFixedDiscountEntity } from './coupon-template-fixed-discount.entity';
import { CouponTemplatePercentDiscountEntity } from './coupon-template-percent-discount.entity';
import { CouponTemplateVariantEntity } from './coupon-template-variant.entity';

export class CouponTemplateEntity {
  public id: string;
  public description: string | null;
  public imagePath: string | null;
  public fixedDiscount: CouponTemplateFixedDiscountEntity | null;
  public percentDiscount: CouponTemplatePercentDiscountEntity | null;
  public variant: CouponTemplateVariantEntity | null;
  public place: CouponTemplatePlaceEntity;

  constructor(data: CouponTemplateEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    couponTemplate: CouponTemplateModel,
  ): CouponTemplateEntity {
    return new CouponTemplateEntity({
      id: couponTemplate.id,
      description: couponTemplate.description,
      imagePath: couponTemplate.imagePath,
      fixedDiscount: couponTemplate.fixedDiscount
        ? CouponTemplateFixedDiscountEntity.fromModel(
            couponTemplate.fixedDiscount,
          )
        : null,
      percentDiscount: couponTemplate.percentDiscount
        ? CouponTemplatePercentDiscountEntity.fromModel(
            couponTemplate.percentDiscount,
          )
        : null,
      variant: couponTemplate.variant
        ? CouponTemplateVariantEntity.fromModel(couponTemplate.variant)
        : null,
      place: CouponTemplatePlaceEntity.fromModel(couponTemplate.place),
    });
  }
}
