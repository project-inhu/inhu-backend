import { Prisma } from '@prisma/client';

export const SELECT_PLACE_ROAD_ADDRESS =
  Prisma.validator<Prisma.RoadAddressDefaultArgs>()({
    select: {
      idx: true,
      addressName: true,
      detailAddress: true,
      addressX: true,
      addressY: true,
    },
  });

export type SelectPlaceRoadAddress = Prisma.RoadAddressGetPayload<
  typeof SELECT_PLACE_ROAD_ADDRESS
>;
