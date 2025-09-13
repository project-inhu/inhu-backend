import { Prisma } from '@prisma/client';
import { SELECT_COUPON_PLACE } from './select-coupon-place';
import { SELECT_COUPON_PRICE_DISCOUNT } from './select-coupon-price-discount';
import { SELECT_COUPON_PERCENT_DISCOUNT } from './select-coupon-percent-discount';
import { SELECT_COUPON_OWN } from './select-coupon-own';

export const SELECT_COUPON = Prisma.validator<Prisma.CouponDefaultArgs>()({
  select: {
    id: true,
    bundleId: true,
    name: true,
    description: true,
    imagePath: true,
    createdAt: true,
    activatedAt: true,
    expiredAt: true,
    usedAt: true,
    place: SELECT_COUPON_PLACE,
    couponPriceDiscount: SELECT_COUPON_PRICE_DISCOUNT,
    couponPercentDiscount: SELECT_COUPON_PERCENT_DISCOUNT,
    couponOwnList: SELECT_COUPON_OWN,
  },
});

export type SelectCoupon = Prisma.CouponGetPayload<typeof SELECT_COUPON>;
