import { Prisma } from '@prisma/client';

export const SELECT_COUPON_FIXED_DISCOUNT =
  Prisma.validator<Prisma.CouponFixedDiscountDefaultArgs>()({
    select: {
      menuName: true,
      price: true,
    },
  });

export type SelectCouponFixedDiscount = Prisma.CouponFixedDiscountGetPayload<
  typeof SELECT_COUPON_FIXED_DISCOUNT
>;
