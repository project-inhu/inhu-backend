import { SELECT_BLOG_REVIEW_PLACE } from '@libs/core/blog-review/model/prisma-type/select-blog-review-place';
import { Prisma } from '@prisma/client';

export const SELECT_BLOG_REVIEW_OVERVIEW =
  Prisma.validator<Prisma.BlogReviewDefaultArgs>()({
    select: {
      idx: true,
      place: SELECT_BLOG_REVIEW_PLACE,
      blogName: true,
      title: true,
      description: true,
      authorName: true,
      authorProfileImagePath: true,
      thumbnailImagePath: true,
      url: true,
      blogType: true,
      createdAt: true,
      uploadedAt: true,
    },
  });

export type SelectBlogReviewOverview = Prisma.BlogReviewGetPayload<
  typeof SELECT_BLOG_REVIEW_OVERVIEW
>;
