import { SELECT_PLACE } from '@app/core/place/model/prisma-type/select-place';
import { Prisma } from '@prisma/client';

export const SELECT_PICKED_PLACE =
  Prisma.validator<Prisma.PickedPlaceDefaultArgs>()({
    select: {
      title: true,
      content: true,
      place: SELECT_PLACE,
    },
  });

export type SelectPickedPlace = Prisma.PickedPlaceGetPayload<
  typeof SELECT_PICKED_PLACE
>;
