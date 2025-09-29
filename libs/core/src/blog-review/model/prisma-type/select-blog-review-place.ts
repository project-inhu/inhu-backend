import { Prisma } from '@prisma/client';

export const SELECT_BLOG_REVIEW_PLACE =
  Prisma.validator<Prisma.PlaceDefaultArgs>()({
    select: {
      idx: true,
    },
  });

export type SelectBlogReviewPlace = Prisma.PlaceGetPayload<
  typeof SELECT_BLOG_REVIEW_PLACE
>;
