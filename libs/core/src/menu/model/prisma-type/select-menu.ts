import { Prisma } from '@prisma/client';

export const SELECT_MENU = Prisma.validator<Prisma.MenuDefaultArgs>()({
  select: {
    idx: true,
    placeIdx: true,
    name: true,
    price: true,
    content: true,
    imagePath: true,
    isFlexible: true,
    createdAt: true,
  },
});

export type SelectMenu = Prisma.MenuGetPayload<typeof SELECT_MENU>;
