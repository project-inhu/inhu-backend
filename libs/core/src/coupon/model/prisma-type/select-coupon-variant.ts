import { Prisma } from '@prisma/client';

export const SELECT_COUPON_VARIANT =
  Prisma.validator<Prisma.CouponVariantDefaultArgs>()({
    select: {
      name: true,
    },
  });

export type SelectCouponVariant = Prisma.CouponVariantGetPayload<
  typeof SELECT_COUPON_VARIANT
>;
