import { CouponModel } from '@libs/core/coupon/model/coupon.model';
import { SelectOwnedCoupon } from './prisma-type/select-owned-coupon';

/**
 * 보유 쿠폰 모델
 *
 * @publicApi
 */
export class OwnedCouponModel {
  /**
   * 쿠폰 소유자 고유 식별자
   */
  public id: string;

  /**
   * 쿠폰 소유자 생성 일시
   */
  public createdAt: Date;

  /**
   * 쿠폰 정보
   */
  public coupon: CouponModel;

  constructor(data: OwnedCouponModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(ownedCoupon: SelectOwnedCoupon): OwnedCouponModel {
    return new OwnedCouponModel({
      id: ownedCoupon.id,
      createdAt: ownedCoupon.createdAt,
      coupon: CouponModel.fromPrisma(ownedCoupon.coupon),
    });
  }
}
