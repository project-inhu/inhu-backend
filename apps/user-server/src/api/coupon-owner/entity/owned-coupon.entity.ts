import { OwnedCouponModel } from '@libs/core/coupon-owner/model/owned-coupon.model';
import { CouponEntity } from '@user/api/coupon/entity/coupon.entity';

export class OwnedCouponEntity {
  /**
   * 쿠폰 소유자 고유 식별자
   *
   * @example '49754469-e47b-4db6-a5bf-4b60bfb85d9b
   */
  id: string;

  /**
   * 쿠폰 소유자 생성 일시
   *
   * @example '2023-10-01T12:00:00Z'
   */
  createdAt: Date;

  /**
   * 쿠폰 정보
   */
  coupon: CouponEntity;

  constructor(data: OwnedCouponEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: OwnedCouponModel): OwnedCouponEntity {
    return new OwnedCouponEntity({
      id: model.id,
      createdAt: model.createdAt,
      coupon: CouponEntity.fromModel(model.coupon),
    });
  }
}
