import { CouponPlaceModel } from '../../coupon/model/coupon-place.model';
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
      place: CouponPlaceModel.fromPrisma(couponTemplate.place),
    });
  }
}
