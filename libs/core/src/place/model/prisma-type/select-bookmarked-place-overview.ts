import { Prisma } from '@prisma/client';

const SELECT_BOOKMARKED_PLACE_OVERVIEW =
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
          isClosedOnHoliday: true,
          createdAt: true,
          permanentlyClosedAt: true,
          activatedAt: true,
          roadAddress: {
            select: {
              idx: true,
              addressName: true,
              detailAddress: true,
              addressX: true,
              addressY: true,
            },
          },
          placeTypeMappingList: {
            select: {
              placeTypeIdx: true,
            },
          },
          placeImageList: {
            select: {
              path: true,
            },
          },
          placeKeywordCountList: {
            select: {
              keyword: {
                select: {
                  idx: true,
                  content: true,
                },
              },
            },
          },
        },
      },
    },
  });

export type SelectBookmarkedPlaceOverview = Prisma.BookmarkGetPayload<
  typeof SELECT_BOOKMARKED_PLACE_OVERVIEW
>;
