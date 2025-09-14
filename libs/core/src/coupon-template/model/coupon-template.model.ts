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
  /**
   * 쿠폰 템플릿 ID
   */
  public id: string;

  /**
   * 쿠폰 추가 설명
   */
  public description: string | null;

  /**
   * 쿠폰 이미지 경로
   */
  public imagePath: string | null;

  /**
   * 고정 할인 쿠폰 정보
   */
  public fixedDiscount: CouponTemplateFixedDiscountModel | null;

  /**
   * 퍼센트 할인 쿠폰 정보
   */
  public percentDiscount: CouponTemplatePercentDiscountModel | null;

  /**
   * 기타 쿠폰 정보
   */
  public variant: CouponTemplateVariantModel | null;

  /**
   * 쿠폰 사용처 정보
   */
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
