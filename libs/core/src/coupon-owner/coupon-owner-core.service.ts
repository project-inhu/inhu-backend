import { Injectable } from '@nestjs/common';
import { CouponOwnerCoreRepository } from './coupon-owner-core.repository';
import { OwnedCouponModel } from './model/owned-coupon.model';
import { GetOwnedCouponAllByUserIdxInput } from './input/get-owned-coupon-all-by-user-idx.input';
import { CreateCouponOwnerInput } from './input/create-coupon-owner.input';
import { CouponOwnerModel } from './model/coupon-owner.model';

@Injectable()
export class CouponOwnerCoreService {
  constructor(
    private readonly couponOwnerCoreRepository: CouponOwnerCoreRepository,
  ) {}

  public async getOwnedCouponAllByUserIdx(
    userIdx: number,
    input: GetOwnedCouponAllByUserIdxInput,
  ): Promise<OwnedCouponModel[]> {
    return await this.couponOwnerCoreRepository
      .selectOwnedCouponAllByUserIdx(userIdx, input)
      .then((coupon) => coupon.map(OwnedCouponModel.fromPrisma));
  }

  public async createCouponOwner(
    input: CreateCouponOwnerInput,
  ): Promise<CouponOwnerModel> {
    return this.couponOwnerCoreRepository
      .insertCouponOwner(input)
      .then(CouponOwnerModel.fromPrisma);
  }
}
