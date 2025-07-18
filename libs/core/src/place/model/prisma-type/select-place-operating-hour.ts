import { Prisma } from '@prisma/client';

const SELECT_PLACE_OPERATING_HOUR =
  Prisma.validator<Prisma.OperatingHourDefaultArgs>()({
    select: {
      idx: true,
      startAt: true,
      endAt: true,
      day: true,
    },
  });

export type SelectPlaceOperatingHour = Prisma.OperatingHourGetPayload<
  typeof SELECT_PLACE_OPERATING_HOUR
>;
