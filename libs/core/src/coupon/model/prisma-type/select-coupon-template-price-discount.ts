import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_PRICE_DISCOUNT =
  Prisma.validator<Prisma.CouponTemplatePriceDiscountDefaultArgs>()({
    select: {
      price: true,
    },
  });

export type SelectCouponTemplatePriceDiscount =
  Prisma.CouponTemplatePriceDiscountGetPayload<
    typeof SELECT_COUPON_TEMPLATE_PRICE_DISCOUNT
  >;
