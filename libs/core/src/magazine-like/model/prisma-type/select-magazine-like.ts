import { Prisma } from '@prisma/client';

export const SELECT_MAGAZINE_LIKE =
  Prisma.validator<Prisma.MagazineLikeDefaultArgs>()({
    select: {
      magazineIdx: true,
      userIdx: true,
      createdAt: true,
    },
  });

export type SelectMagazineLike = Prisma.MagazineLikeGetPayload<
  typeof SELECT_MAGAZINE_LIKE
>;
