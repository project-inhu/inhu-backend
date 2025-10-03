import { Prisma } from '@prisma/client';
import { SELECT_REVIEW } from '@libs/core/review/model/prisma-type/select-review';

export const SELECT_MENU = Prisma.validator<Prisma.MenuDefaultArgs>()({
  select: {
    idx: true,
    placeIdx: true,
    name: true,
    price: true,
    content: true,
    imagePath: true,
    isFlexible: true,
    sortOrder: true,
    createdAt: true,
    reviewList: {
      select: {
        review: SELECT_REVIEW,
      },
    },
  },
});

export type SelectMenu = Prisma.MenuGetPayload<typeof SELECT_MENU>;
