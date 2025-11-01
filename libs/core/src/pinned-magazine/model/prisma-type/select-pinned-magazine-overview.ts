import { SELECT_MAGAZINE_OVERVIEW } from '@libs/core/magazine/model/prisma-type/select-magazine-overview';
import { Prisma } from '@prisma/client';

export const SELECT_PINNED_MAGAZINE_OVERVIEW =
  Prisma.validator<Prisma.PinnedMagazineDefaultArgs>()({
    select: {
      createdAt: true,
      magazine: SELECT_MAGAZINE_OVERVIEW,
    },
  });

export type SelectPinnedMagazineOverview = Prisma.PinnedMagazineGetPayload<
  typeof SELECT_PINNED_MAGAZINE_OVERVIEW
>;
