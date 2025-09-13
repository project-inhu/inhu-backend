import { SelectCouponOwn } from './prisma-type/select-coupon-own';

export class CouponOwnModel {
  public userIdx: number;
  public createdAt: Date;

  constructor(data: CouponOwnModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(couponOwn: SelectCouponOwn): CouponOwnModel {
    return new CouponOwnModel({
      userIdx: couponOwn.userIdx,
      createdAt: couponOwn.createdAt,
    });
  }
}
