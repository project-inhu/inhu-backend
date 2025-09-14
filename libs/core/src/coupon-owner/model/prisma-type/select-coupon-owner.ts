import { Prisma } from '@prisma/client';

export const SELECT_COUPON_OWNER =
  Prisma.validator<Prisma.CouponOwnerDefaultArgs>()({
    select: {
      id: true,
      couponId: true,
      userIdx: true,
      createdAt: true,
    },
  });

export type SelectCouponOwner = Prisma.CouponOwnerGetPayload<
  typeof SELECT_COUPON_OWNER
>;
