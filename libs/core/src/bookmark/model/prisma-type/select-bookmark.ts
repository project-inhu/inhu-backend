import { Prisma } from '@prisma/client';

const SELECT_BOOKMARK = Prisma.validator<Prisma.BookmarkDefaultArgs>()({
  select: {
    placeIdx: true,
    userIdx: true,
    createdAt: true,
  },
});

export type SelectBookmark = Prisma.BookmarkGetPayload<typeof SELECT_BOOKMARK>;
