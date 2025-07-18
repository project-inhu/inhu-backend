import { Prisma } from '@prisma/client';

const SELECT_REVIEW_PLACE = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    roadAddress: {
      select: {
        addressName: true,
        detailAddress: true,
      },
    },
  },
});

export type SelectReviewPlace = Prisma.PlaceGetPayload<
  typeof SELECT_REVIEW_PLACE
>;
