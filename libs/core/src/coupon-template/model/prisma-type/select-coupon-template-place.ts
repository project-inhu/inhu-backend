import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_PLACE =
  Prisma.validator<Prisma.PlaceDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

export type SelectCouponTemplatePlace = Prisma.PlaceGetPayload<
  typeof SELECT_COUPON_TEMPLATE_PLACE
>;
