import { SELECT_MAGAZINE } from '@libs/core/magazine/model/prisma-type/select-magazine';
import { Prisma } from '@prisma/client';

export const SELECT_PINNED_MAGAZINE =
  Prisma.validator<Prisma.PinnedMagazineDefaultArgs>()({
    select: {
      createdAt: true,
      magazine: SELECT_MAGAZINE,
    },
  });

export type SelectPinnedMagazine = Prisma.PinnedMagazineGetPayload<
  typeof SELECT_PINNED_MAGAZINE
>;
