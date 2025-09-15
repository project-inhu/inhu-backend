import { Prisma } from '@prisma/client';

export const SELECT_COUPON_TEMPLATE_ETC =
  Prisma.validator<Prisma.CouponTemplateEtcDefaultArgs>()({
    select: {
      name: true,
    },
  });

export type SelectCouponTemplateEtc = Prisma.CouponTemplateEtcGetPayload<
  typeof SELECT_COUPON_TEMPLATE_ETC
>;
