import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_PERCENT_DISCOUNT =
  Prisma.validator<Prisma.CouponTemplatePercentDiscountDefaultArgs>()({
    select: {
      menuName: true,
      percent: true,
      maxPrice: true,
    },
  });

export type SelectCouponTemplatePercentDiscount =
  Prisma.CouponTemplatePercentDiscountGetPayload<
    typeof SELECT_COUPON_TEMPLATE_PERCENT_DISCOUNT
  >;
