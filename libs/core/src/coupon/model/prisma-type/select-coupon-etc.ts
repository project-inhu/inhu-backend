import { Prisma } from '@prisma/client';

export const SELECT_COUPON_ETC =
  Prisma.validator<Prisma.CouponEtcDefaultArgs>()({
    select: {
      name: true,
    },
  });

export type SelectCouponEtc = Prisma.CouponEtcGetPayload<
  typeof SELECT_COUPON_ETC
>;
