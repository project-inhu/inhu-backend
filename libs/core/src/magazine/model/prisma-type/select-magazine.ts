import { Prisma } from '@prisma/client';
import { SELECT_MAGAZINE_PLACE } from './select-magazine-place';

export const SELECT_MAGAZINE = Prisma.validator<Prisma.MagazineDefaultArgs>()({
  select: {
    idx: true,
    title: true,
    description: true,
    content: true,
    thumbnailImagePath: true,
    isTitleVisible: true,
    likeCount: true,
    viewCount: true,
    createdAt: true,
    activatedAt: true,
    pinnedAt: true,
    placeList: SELECT_MAGAZINE_PLACE,
  },
});

export type SelectMagazine = Prisma.MagazineGetPayload<typeof SELECT_MAGAZINE>;
