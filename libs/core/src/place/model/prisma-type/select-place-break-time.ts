import { Prisma } from '@prisma/client';

const SELECT_PLACE_BREAK_TIME = Prisma.validator<Prisma.BreakTimeDefaultArgs>()(
  {
    select: {
      idx: true,
      startAt: true,
      endAt: true,
      day: true,
    },
  },
);

export type SelectPlaceBreakTime = Prisma.BreakTimeGetPayload<
  typeof SELECT_PLACE_BREAK_TIME
>;
