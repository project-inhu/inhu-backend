import { Prisma } from '@prisma/client';

export const SELECT_REVIEW_AUTHOR = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
  },
});

export type SelectReviewAuthor = Prisma.UserGetPayload<
  typeof SELECT_REVIEW_AUTHOR
>;
