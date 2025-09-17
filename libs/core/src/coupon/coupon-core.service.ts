import { Injectable } from '@nestjs/common';
import { CouponCoreRepository } from './coupon-core.repository';
import { CouponModel } from './model/coupon.model';
import { CreateCouponInput } from './inputs/create-coupon.input';
import { SelectCoupon } from './model/prisma-type/select-coupon';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { v4 as uuidv4 } from 'uuid';
import { GetCouponAllByPlaceIdxInput } from './inputs/get-coupon-all-by-place-idx.input';

@Injectable()
export class CouponCoreService {
  constructor(
    private readonly couponCoreRepository: CouponCoreRepository,
    private readonly dateUtilService: DateUtilService,
  ) {}

  public async getCouponAllByPlaceIdx(
    placeIdx: number,
    input: GetCouponAllByPlaceIdxInput,
  ): Promise<CouponModel[]> {
    return await this.couponCoreRepository
      .getCouponAllByPlaceIdx(placeIdx, input)
      .then((coupons) => coupons.map(CouponModel.fromPrisma));
  }

  public async createCoupon(
    input: CreateCouponInput,
    count: number,
  ): Promise<void> {
    const now = this.dateUtilService.getNow();
    const activatedAt = new Date(now.getTime() + 1000 * 60);
    const bundleId = uuidv4();
    for (let i = 0; i < count; i++) {
      await this.couponCoreRepository.insertCoupon(
        input,
        bundleId,
        activatedAt,
      );
    }
  }

  public async deleteCouponAllByBundleId(bundleId: string): Promise<void> {
    await this.couponCoreRepository.deleteCouponAllByBundleId(bundleId);
  }
}
