import { Prisma } from '@prisma/client';

export const SELECT_PLACE_OWNER =
  Prisma.validator<Prisma.PlaceOwnerDefaultArgs>()({
    select: {
      id: true,
      placeIdx: true,
    },
  });

export type SelectPlaceOwner = Prisma.PlaceOwnerGetPayload<
  typeof SELECT_PLACE_OWNER
>;
