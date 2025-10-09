import { SELECT_PLACE_ROAD_ADDRESS } from '@libs/core/place/model/prisma-type/select-place-road-address';
import { Prisma } from '@prisma/client';

export const SELECT_MAGAZINE_PLACE =
  Prisma.validator<Prisma.MagazinePlaceDefaultArgs>()({
    select: {
      place: {
        select: {
          idx: true,
          name: true,
          tel: true,
          roadAddress: SELECT_PLACE_ROAD_ADDRESS,
          placeImageList: {
            select: { path: true },
            where: { deletedAt: null },
            orderBy: { idx: 'asc' },
          },
        },
      },
    },
  });

export type SelectMagazinePlace = Prisma.MagazinePlaceGetPayload<
  typeof SELECT_MAGAZINE_PLACE
>;
