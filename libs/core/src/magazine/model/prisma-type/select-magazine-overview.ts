import { Prisma } from '@prisma/client';

export const SELECT_MAGAZINE_OVERVIEW =
  Prisma.validator<Prisma.MagazineDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      thumbnailImagePath: true,
      isTitleVisible: true,
      createdAt: true,
      activatedAt: true,
    },
  });

export type SelectMagazineOverview = Prisma.MagazineGetPayload<
  typeof SELECT_MAGAZINE_OVERVIEW
>;
