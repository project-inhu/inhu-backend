import { Prisma } from '@prisma/client';

export const SELECT_REVIEW_PLACE = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    roadAddress: {
      select: {
        idx: true,
        addressName: true,
        detailAddress: true,
        addressX: true,
        addressY: true,
      },
    },
    placeTypeMappingList: {
      select: {
        placeTypeIdx: true,
      },
    },
  },
});

export type SelectReviewPlace = Prisma.PlaceGetPayload<
  typeof SELECT_REVIEW_PLACE
>;
