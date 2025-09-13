import { SELECT_REVIEW_AUTHOR } from './select-review-author';
import { SELECT_REVIEW_PLACE } from './select-review-place';
import { Prisma } from '@prisma/client';

export const SELECT_REVIEW = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  select: {
    idx: true,
    content: true,
    createdAt: true,
    reviewImageList: {
      select: {
        imagePath: true,
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
    user: SELECT_REVIEW_AUTHOR,
    place: SELECT_REVIEW_PLACE,
  },
});

export type SelectReview = Prisma.ReviewGetPayload<typeof SELECT_REVIEW>;
