import { Prisma } from '@prisma/client';

export const SELECT_COUPON_PRICE_DISCOUNT =
  Prisma.validator<Prisma.CouponPriceDiscountDefaultArgs>()({
    select: {
      idx: true,
      price: true,
    },
  });

export type SelectCouponPriceDiscount = Prisma.CouponPriceDiscountGetPayload<
  typeof SELECT_COUPON_PRICE_DISCOUNT
>;
