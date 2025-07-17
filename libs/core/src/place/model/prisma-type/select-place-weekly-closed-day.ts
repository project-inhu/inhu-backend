import { Prisma } from '@prisma/client';

const SELECT_PLACE_WEEKLY_CLOSED_DAY =
  Prisma.validator<Prisma.WeeklyClosedDayDefaultArgs>()({
    select: {
      idx: true,
      closedDate: true,
      type: true,
    },
  });

export type SelectPlaceWeeklyClosedDay = Prisma.WeeklyClosedDayGetPayload<
  typeof SELECT_PLACE_WEEKLY_CLOSED_DAY
>;
