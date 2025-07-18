import { Prisma } from '@prisma/client';

const SELECT_PLACE_OVERVIEW = Prisma.validator<Prisma.PlaceDefaultArgs>()({
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
    placeImageList: {
      select: {
        path: true,
      },
    },
  },
});

export type SelectPlaceOverview = Prisma.PlaceGetPayload<
  typeof SELECT_PLACE_OVERVIEW
>;
