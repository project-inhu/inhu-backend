import { Prisma } from '@prisma/client';
import { SELECT_COUPON_PLACE } from './select-coupon-place';

export const SELECT_COUPON_TEMPLATE =
  Prisma.validator<Prisma.CouponTemplateDefaultArgs>()({
    select: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      place: SELECT_COUPON_PLACE,
    },
  });

export type SelectCouponTemplate = Prisma.CouponTemplateGetPayload<
  typeof SELECT_COUPON_TEMPLATE
>;
