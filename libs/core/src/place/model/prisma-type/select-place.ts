import { Prisma } from '@prisma/client';

const SELECT_PLACE = Prisma.validator<Prisma.PlaceDefaultArgs>()({
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
    placeImageList: {
      select: {
        path: true,
      },
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
