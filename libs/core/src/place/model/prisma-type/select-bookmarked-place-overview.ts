import { Prisma } from '@prisma/client';

export const SELECT_BOOKMARKED_PLACE_OVERVIEW =
  Prisma.validator<Prisma.BookmarkDefaultArgs>()({
    select: {
      createdAt: true,
      place: {
        select: {
          idx: true,
          name: true,
          tel: true,
          reviewCount: true,
          bookmarkCount: true,
          activatedAt: true,
          isClosedOnHoliday: true,
          createdAt: true,
          permanentlyClosedAt: true,
          placeImageList: {
            select: { path: true },
            where: { deletedAt: null },
            orderBy: { idx: 'asc' },
          },
          placeKeywordCountList: {
            take: 2,
            orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
            select: {
              keyword: { select: { content: true, idx: true } },
            },
          },
          placeTypeMappingList: {
            select: {
              placeTypeIdx: true,
            },
          },
          roadAddress: {
            select: {
              idx: true,
              addressName: true,
              detailAddress: true,
              addressX: true,
              addressY: true,
            },
          },
        },
      },
    },
  });

export type SelectBookmarkedPlaceOverview = Prisma.BookmarkGetPayload<
  typeof SELECT_BOOKMARKED_PLACE_OVERVIEW
>;
