import { Prisma } from '@prisma/client';
import { SELECT_PLACE_ROAD_ADDRESS } from './select-place-road-address';

export const SELECT_PLACE = Prisma.validator<Prisma.PlaceDefaultArgs>()({
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
    placeKeywordCountList: {
      take: 2,
      orderBy: {
        count: 'desc',
      },
      select: {
        keyword: { select: { content: true, idx: true } },
      },
      where: {
        count: { gt: 0 },
      },
    },
    roadAddress: SELECT_PLACE_ROAD_ADDRESS,
    placeImageList: {
      select: { path: true },
      where: { deletedAt: null },
      orderBy: { idx: 'asc' },
    },
    placeTypeMappingList: {
      select: {
        placeTypeIdx: true,
      },
    },
    closedDayList: {
      select: {
        idx: true,
        day: true,
        week: true,
      },
    },
    operatingHourList: {
      select: {
        idx: true,
        day: true,
        startAt: true,
        endAt: true,
      },
    },
    weeklyClosedDayList: {
      select: {
        idx: true,
        closedDate: true,
        type: true,
      },
    },
    breakTimeList: {
      select: {
        idx: true,
        day: true,
        startAt: true,
        endAt: true,
      },
    },
  },
});

export type SelectPlace = Prisma.PlaceGetPayload<typeof SELECT_PLACE>;
