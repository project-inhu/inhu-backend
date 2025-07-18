import { Prisma } from '@prisma/client';

const SELECT_REVIEW = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  select: {
    idx: true,
    userIdx: true,
    placeIdx: true,
    content: true,
    createdAt: true,
    reviewImageList: {
      select: {
        path: true,
      },
    },
    reviewKeywordMappingList: {
      select: {
        keyword: {
          select: {
            idx: true,
            content: true,
          },
        },
      },
    },
    user: {
      select: {
        nickname: true,
        profileImagePath: true,
      },
    },
    place: {
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
    },
  },
});

export type SelectReview = Prisma.ReviewGetPayload<typeof SELECT_REVIEW>;
