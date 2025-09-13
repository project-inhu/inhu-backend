import { Prisma } from '@prisma/client';

export const SELECT_COUPON_OWN =
  Prisma.validator<Prisma.CouponOwnDefaultArgs>()({
    select: {
      userIdx: true,
      createdAt: true,
    },
  });

export type SelectCouponOwn = Prisma.CouponOwnGetPayload<
  typeof SELECT_COUPON_OWN
>;
