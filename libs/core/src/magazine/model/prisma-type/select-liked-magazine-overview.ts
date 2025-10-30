import { Prisma } from '@prisma/client';

export const SELECT_LIKED_MAGAZINE_OVERVIEW =
  Prisma.validator<Prisma.MagazineLikeDefaultArgs>()({
    select: {
      createdAt: true,
      magazine: {
        select: {
          idx: true,
          title: true,
          description: true,
          thumbnailImagePath: true,
          isTitleVisible: true,
          likeCount: true,
          viewCount: true,
          createdAt: true,
          activatedAt: true,
        },
      },
    },
  });

export type SelectLikedMagazineOverview = Prisma.MagazineLikeGetPayload<
  typeof SELECT_LIKED_MAGAZINE_OVERVIEW
>;
