import { CouponModel } from '@libs/core/coupon/model/coupon.model';
import { UserModel } from '@libs/core/user/model/user.model';
import { SelectCouponOwner } from './prisma-type/select-coupon-owner';

/**
 * 쿠폰 소유자 모델
 *
 * @publicApi
 */
export class CouponOwnerModel {
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

  /**
   * 사용자 정보
   */
  public user: UserModel;

  constructor(data: CouponOwnerModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(couponOwner: SelectCouponOwner): CouponOwnerModel {
    return new CouponOwnerModel({
      id: couponOwner.id,
      createdAt: couponOwner.createdAt,
      coupon: CouponModel.fromPrisma(couponOwner.coupon),
      user: UserModel.fromPrisma(couponOwner.user),
    });
  }
}
