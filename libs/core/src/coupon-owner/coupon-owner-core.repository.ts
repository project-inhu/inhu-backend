import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_OWNED_COUPON,
  SelectOwnedCoupon,
} from './model/prisma-type/select-owned-coupon';
import { GetOwnedCouponAllByUserIdxInput } from './input/get-owned-coupon-all-by-user-idx.input';
import {
  SELECT_COUPON_OWNER,
  SelectCouponOwner,
} from './model/prisma-type/select-coupon-owner';
import { CreateCouponOwnerInput } from './input/create-coupon-owner.input';

@Injectable()
export class CouponOwnerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectOwnedCouponAllByUserIdx(
    userIdx: number,
    input: GetOwnedCouponAllByUserIdxInput,
  ): Promise<SelectOwnedCoupon[]> {
    return this.txHost.tx.couponOwner.findMany({
      ...SELECT_OWNED_COUPON,
      where: { userIdx, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: input.take,
      skip: input.skip,
    });
  }

  public async insertCouponOwner(
    input: CreateCouponOwnerInput,
  ): Promise<SelectCouponOwner> {
    return this.txHost.tx.couponOwner.create({
      ...SELECT_COUPON_OWNER,
      data: {
        couponId: input.couponId,
        userIdx: input.userIdx,
      },
    });
  }
}
