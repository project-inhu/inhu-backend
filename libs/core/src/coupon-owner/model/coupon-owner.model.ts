import { SelectCouponOwner } from '../../coupon-owner/model/prisma-type/select-coupon-owner';

/**
 * 쿠폰 소유자 모델
 *
 * @publicApi
 */
export class CouponOwnerModel {
  public id: string;
  public couponId: string;
  public userIdx: number;
  public createdAt: Date;

  constructor(data: CouponOwnerModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(couponOwner: SelectCouponOwner): CouponOwnerModel {
    return new CouponOwnerModel({
      id: couponOwner.id,
      couponId: couponOwner.couponId,
      userIdx: couponOwner.userIdx,
      createdAt: couponOwner.createdAt,
    });
  }
}
