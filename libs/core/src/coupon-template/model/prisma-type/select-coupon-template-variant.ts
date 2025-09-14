import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_VARIANT =
  Prisma.validator<Prisma.CouponTemplateVariantDefaultArgs>()({
    select: {
      name: true,
    },
  });

export type SelectCouponTemplateVariant =
  Prisma.CouponTemplateVariantGetPayload<typeof SELECT_COUPON_TEMPLATE_VARIANT>;
