import { SELECT_PLACE_OVERVIEW } from '@app/core/place/model/prisma-type/select-place-overview';
import { Prisma } from '@prisma/client';

export const SELECT_PICKED_PLACE_OVERVIEW =
  Prisma.validator<Prisma.PickedPlaceDefaultArgs>()({
    select: {
      title: true,
      content: true,
      place: SELECT_PLACE_OVERVIEW,
    },
  });

export type SelectPickedPlaceOverview = Prisma.PickedPlaceGetPayload<
  typeof SELECT_PICKED_PLACE_OVERVIEW
>;
