import { Prisma } from '@prisma/client';
import { SELECT_COUPON_TEMPLATE_FIXED_DISCOUNT } from './select-coupon-template-fixed-discount';
import { SELECT_COUPON_TEMPLATE_PERCENT_DISCOUNT } from './select-coupon-template-percent-discount';
import { SELECT_COUPON_TEMPLATE_ETC } from './select-coupon-template-etc';
import { SELECT_COUPON_TEMPLATE_PLACE } from './select-coupon-template-place';

export const SELECT_COUPON_TEMPLATE =
  Prisma.validator<Prisma.CouponTemplateDefaultArgs>()({
    select: {
      id: true,
      description: true,
      imagePath: true,
      fixedDiscount: SELECT_COUPON_TEMPLATE_FIXED_DISCOUNT,
      percentDiscount: SELECT_COUPON_TEMPLATE_PERCENT_DISCOUNT,
      etc: SELECT_COUPON_TEMPLATE_ETC,
      place: SELECT_COUPON_TEMPLATE_PLACE,
    },
  });

export type SelectCouponTemplate = Prisma.CouponTemplateGetPayload<
  typeof SELECT_COUPON_TEMPLATE
>;
