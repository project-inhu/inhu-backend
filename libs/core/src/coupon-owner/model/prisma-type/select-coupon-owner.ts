import { SELECT_COUPON } from '@libs/core/coupon/model/prisma-type/select-coupon';
import { SELECT_USER } from '@libs/core/user/model/prisma-type/select-user';
import { Prisma } from '@prisma/client';

export const SELECT_COUPON_OWNER =
  Prisma.validator<Prisma.CouponOwnerDefaultArgs>()({
    select: {
      id: true,
      createdAt: true,
      coupon: SELECT_COUPON,
      user: SELECT_USER,
    },
  });

export type SelectCouponOwner = Prisma.CouponOwnerGetPayload<
  typeof SELECT_COUPON_OWNER
>;
