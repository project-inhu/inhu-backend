import { SELECT_COUPON } from '@libs/core/coupon/model/prisma-type/select-coupon';
import { Prisma } from '@prisma/client';

export const SELECT_OWNED_COUPON =
  Prisma.validator<Prisma.CouponOwnerDefaultArgs>()({
    select: {
      id: true,
      createdAt: true,
      coupon: SELECT_COUPON,
    },
  });

export type SelectOwnedCoupon = Prisma.CouponOwnerGetPayload<
  typeof SELECT_OWNED_COUPON
>;
