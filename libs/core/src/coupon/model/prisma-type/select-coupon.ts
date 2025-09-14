import { Prisma } from '@prisma/client';
import { SELECT_COUPON_PLACE } from './select-coupon-place';
import { SELECT_COUPON_FIXED_DISCOUNT } from './select-coupon-fixed-discount';
import { SELECT_COUPON_PERCENT_DISCOUNT } from './select-coupon-percent-discount';
import { SELECT_COUPON_VARIANT } from './select-coupon-variant';

export const SELECT_COUPON = Prisma.validator<Prisma.CouponDefaultArgs>()({
  select: {
    id: true,
    bundleId: true,
    description: true,
    imagePath: true,
    createdAt: true,
    activatedAt: true,
    expiredAt: true,
    usedAt: true,
    fixedDiscount: SELECT_COUPON_FIXED_DISCOUNT,
    percentDiscount: SELECT_COUPON_PERCENT_DISCOUNT,
    variant: SELECT_COUPON_VARIANT,
    place: SELECT_COUPON_PLACE,
  },
});

export type SelectCoupon = Prisma.CouponGetPayload<typeof SELECT_COUPON>;
