import { Prisma } from '@prisma/client';

const SELECT_REVIEW_KEYWORD = Prisma.validator<Prisma.KeywordDefaultArgs>()({
  select: {
    idx: true,
    content: true,
  },
});

export type SelectReviewKeyword = Prisma.KeywordGetPayload<
  typeof SELECT_REVIEW_KEYWORD
>;
