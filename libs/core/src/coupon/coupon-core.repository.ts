import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_COUPON, SelectCoupon } from './model/prisma-type/select-coupon';
import { CreateCouponInput } from './inputs/create-coupon.input';
import { GetCouponAllByPlaceIdxInput } from './inputs/get-coupon-all-by-place-idx.input';

@Injectable()
export class CouponCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async getCouponAllByPlaceIdx(
    placeIdx: number,
    input: GetCouponAllByPlaceIdxInput,
  ): Promise<SelectCoupon[]> {
    return this.txHost.tx.coupon.findMany({
      ...SELECT_COUPON,
      where: {
        usablePlaceIdx: placeIdx,
        expiredAt: { gte: new Date() },
        deletedAt: null,
      },
      orderBy: [{ bundleId: 'asc' }, { id: 'asc' }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async insertCoupon(
    input: CreateCouponInput,
    bundleId: string,
    activatedAt: Date,
  ): Promise<void> {
    await this.txHost.tx.coupon.create({
      data: {
        bundleId,
        description: input.description,
        imagePath: input.imagePath,
        activatedAt,
        expiredAt: input.expiredAt,
        usablePlaceIdx: input.usablePlaceIdx,
        fixedDiscount: input.fixedDiscount
          ? {
              create: {
                menuName: input.fixedDiscount.menuName,
                price: input.fixedDiscount.price,
              },
            }
          : undefined,
        percentDiscount: input.percentDiscount
          ? {
              create: {
                menuName: input.percentDiscount.menuName,
                percent: input.percentDiscount.percent,
                maxPrice: input.percentDiscount.maxPrice,
              },
            }
          : undefined,
        etc: input.etc
          ? {
              create: {
                name: input.etc.name,
              },
            }
          : undefined,
      },
    });
  }

  public async deleteCouponAllByBundleId(bundleId: string): Promise<void> {
    await this.txHost.tx.coupon.deleteMany({
      where: { bundleId },
    });
  }
}
