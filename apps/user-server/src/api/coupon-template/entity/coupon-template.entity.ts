import { CouponTemplateModel } from '@libs/core/coupon-template/model/coupon-template.model';
import { CouponTemplatePlaceEntity } from './coupon-template-place.entity';
import { CouponTemplateFixedDiscountEntity } from './coupon-template-fixed-discount.entity';
import { CouponTemplatePercentDiscountEntity } from './coupon-template-percent-discount.entity';
import { CouponTemplateEtcEntity } from './coupon-template-etc.entity';
import { CouponTemplateType } from '@libs/core/coupon-template/constants/coupon-template-type.enum';

export class CouponTemplateEntity {
  /**
   * 쿠폰 템플릿 ID
   *
   * @example '49754469-e47b-4db6-a5bf-4b60bfb85d9b'
   */
  public id: string;

  /**
   * 쿠폰 추가 설명
   *
   * @example '2인 이상 방문 시 사용 가능'
   */
  public description: string | null;

  /**
   * 쿠폰 이미지 경로
   *
   * @example '/menu/00001.png'
   */
  public imagePath: string | null;

  /**
   * 고정 할인 쿠폰 정보
   *
   * @example 'null'
   */
  public fixedDiscount: CouponTemplateFixedDiscountEntity | null;

  /**
   * 퍼센트 할인 쿠폰 정보
   */
  public percentDiscount: CouponTemplatePercentDiscountEntity | null;

  /**
   * 기타 쿠폰 정보
   *
   * @example 'null'
   */
  public etc: CouponTemplateEtcEntity | null;

  /**
   * 쿠폰 사용처 정보
   */
  public place: CouponTemplatePlaceEntity;

  /**
   * 쿠폰 템플릿 타입
   *
   * - 1: 고정 할인
   * - 2: 퍼센트 할인
   * - 3: 기타
   *
   * @example 2
   */
  public type: CouponTemplateType;

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
      etc: couponTemplate.etc
        ? CouponTemplateEtcEntity.fromModel(couponTemplate.etc)
        : null,
      place: CouponTemplatePlaceEntity.fromModel(couponTemplate.place),
      type: couponTemplate.type,
    });
  }
}
