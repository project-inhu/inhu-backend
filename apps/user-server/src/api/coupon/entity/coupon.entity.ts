import { CouponModel } from '@libs/core/coupon/model/coupon.model';
import { CouponFixedDiscountEntity } from './coupon-fixed-discount.entity';
import { CouponPercentDiscountEntity } from './coupon-percent-discount.entity';
import { CouponVariantEntity } from './coupon-variant.entity';
import { CouponPlaceEntity } from './coupon-place.entity';

export class CouponEntity {
  /**
   * 쿠폰 ID
   *
   * @example '49754469-e47b-4db6-a5bf-4b60bfb85d9b'
   */
  public id: string;

  /**
   * 쿠폰 묶음 ID
   *
   * @example 'd290f1ee-6c54-4b01-90e6-d701748f0851'
   */
  public bundleId: string;

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
   * 생성 일시
   *
   * @example '2023-10-01T12:00:00Z'
   */
  public createdAt: Date;

  /**
   * 쿠폰 활성화 일시
   *
   * @example '2023-10-01T12:01:00Z'
   */
  public activatedAt: Date;

  /**
   * 쿠폰 만료 일시
   *
   * @example '2023-10-01T15:00:00Z'
   */
  public expiredAt: Date;

  /**
   * 쿠폰 사용 일시
   *
   * @example '2023-10-01T13:00:00Z'
   */
  public usedAt: Date | null;

  /**
   * 고정 할인 쿠폰 정보
   */
  public fixedDiscount: CouponFixedDiscountEntity | null;

  /**
   * 퍼센트 할인 쿠폰 정보
   *
   * @example 'null'
   */
  public percentDiscount: CouponPercentDiscountEntity | null;

  /**
   * 기타 쿠폰 정보
   *
   * @example 'null'
   */
  public variant: CouponVariantEntity | null;

  /**
   * 쿠폰 사용처 정보
   */
  public place: CouponPlaceEntity;

  constructor(data: CouponEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponModel): CouponEntity {
    return new CouponEntity({
      id: model.id,
      bundleId: model.bundleId,
      description: model.description,
      imagePath: model.imagePath,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      expiredAt: model.expiredAt,
      usedAt: model.usedAt,
      fixedDiscount: model.fixedDiscount
        ? CouponFixedDiscountEntity.fromModel(model.fixedDiscount)
        : null,
      percentDiscount: model.percentDiscount
        ? CouponPercentDiscountEntity.fromModel(model.percentDiscount)
        : null,
      variant: model.variant
        ? CouponVariantEntity.fromModel(model.variant)
        : null,
      place: CouponPlaceEntity.fromModel(model.place),
    });
  }
}
