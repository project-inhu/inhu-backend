import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 북마크 데이터
 *
 * `BookmarkEntity`로 변환되기 전의 원시 데이터
 *
 * @author 강정연
 */
export const BOOKMARK_SELECT_FIELD =
  Prisma.validator<Prisma.BookmarkDefaultArgs>()({
    select: {
      idx: true,
      userIdx: true,
      placeIdx: true,
      createdAt: true,
      deletedAt: true,
    },
  });

/**
 * `BOOKMARK_SELECT_FIELD`의 Prisma 반환 타입
 */
export type BookmarkSelectField = Prisma.BookmarkGetPayload<
  typeof BOOKMARK_SELECT_FIELD
>;
