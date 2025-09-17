import { CouponOwnerModel } from '@libs/core/coupon-owner/model/coupon-owner.model';
import { CouponEntity } from '@user/api/coupon/entity/coupon.entity';
import { UserEntity } from '@user/api/user/entity/user.entity';

export class CouponOwnerEntity {
  /**
   * 쿠폰 소유자 고유 식별자
   *
   * @example '49754469-e47b-4db6-a5bf-4b60bfb85d9b'
   */
  id: string;

  /**
   * 쿠폰 소유자 생성 일시
   *
   * @example '2024-06-01T12:00:00.000Z'
   */
  createdAt: Date;

  /**
   * 쿠폰 정보
   */
  coupon: CouponEntity;

  /**
   * 사용자 정보
   */
  user: UserEntity;

  constructor(data: CouponOwnerEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CouponOwnerModel): CouponOwnerEntity {
    return new CouponOwnerEntity({
      id: model.id,
      createdAt: model.createdAt,
      coupon: CouponEntity.fromModel(model.coupon),
      user: UserEntity.fromModel(model.user),
    });
  }
}
