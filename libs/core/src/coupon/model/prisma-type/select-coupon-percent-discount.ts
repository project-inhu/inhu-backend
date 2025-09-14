import { Prisma } from '@prisma/client';

export const SELECT_COUPON_PERCENT_DISCOUNT =
  Prisma.validator<Prisma.CouponPercentDiscountDefaultArgs>()({
    select: {
      menuName: true,
      percent: true,
      maxPrice: true,
    },
  });

export type SelectCouponPercentDiscount =
  Prisma.CouponPercentDiscountGetPayload<typeof SELECT_COUPON_PERCENT_DISCOUNT>;
