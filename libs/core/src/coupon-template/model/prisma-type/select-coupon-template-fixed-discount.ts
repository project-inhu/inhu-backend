import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_FIXED_DISCOUNT =
  Prisma.validator<Prisma.CouponTemplateFixedDiscountDefaultArgs>()({
    select: {
      menuName: true,
      price: true,
    },
  });

export type SelectCouponTemplateFixedDiscount =
  Prisma.CouponTemplateFixedDiscountGetPayload<
    typeof SELECT_COUPON_TEMPLATE_FIXED_DISCOUNT
  >;
