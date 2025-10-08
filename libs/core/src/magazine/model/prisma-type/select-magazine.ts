import { Prisma } from '@prisma/client';
import { SELECT_MAGAZINE_PLACE } from './select-magazine-place';

export const SELECT_MAGAZINE = Prisma.validator<Prisma.MagazineDefaultArgs>()({
  select: {
    idx: true,
    title: true,
    content: true,
    isTitleVisible: true,
    createdAt: true,
    activatedAt: true,
    placeList: SELECT_MAGAZINE_PLACE,
  },
});

export type SelectMagazine = Prisma.MagazineGetPayload<typeof SELECT_MAGAZINE>;
