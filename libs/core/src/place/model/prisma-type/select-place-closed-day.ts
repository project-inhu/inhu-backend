import { Prisma } from '@prisma/client';

const SELECT_PLACE_CLOSED_DAY = Prisma.validator<Prisma.ClosedDayDefaultArgs>()(
  {
    select: {
      idx: true,
      day: true,
      week: true,
    },
  },
);

export type SelectPlaceClosedDay = Prisma.ClosedDayGetPayload<
  typeof SELECT_PLACE_CLOSED_DAY
>;
