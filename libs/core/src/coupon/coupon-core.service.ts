import { Injectable } from '@nestjs/common';
import { CouponCoreRepository } from './coupon-core.repository';
import { CouponModel } from './model/coupon.model';
import { CreateCouponInput } from './inputs/create-coupon.input';
import { SelectCoupon } from './model/prisma-type/select-coupon';

@Injectable()
export class CouponCoreService {
  constructor(private readonly couponCoreRepository: CouponCoreRepository) {}

  public async getCouponAllByPlaceIdx(
    placeIdx: number,
  ): Promise<CouponModel[]> {
    return await this.couponCoreRepository
      .getCouponAllByPlaceIdx(placeIdx)
      .then((coupons) => coupons.map(CouponModel.fromPrisma));
  }

  public async createCoupon(
    input: CreateCouponInput,
    count: number,
  ): Promise<CouponModel[]> {
    const createCouponPromises: Promise<SelectCoupon>[] = [];
    for (let i = 0; i < count; i++) {
      createCouponPromises.push(this.couponCoreRepository.insertCoupon(input));
    }
    return (await Promise.all(createCouponPromises)).map(
      CouponModel.fromPrisma,
    );
  }
}
