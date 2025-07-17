import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 리뷰 데이터
 *
 * `ReviewEntity`로 변환되기 전의 원시 데이터
 *
 * @author 강정연
 */
const REVIEW_SELECT_FIELD = Prisma.validator<Prisma.ReviewDefaultArgs>()({
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

/**
 * `REVIEW_SELECT_FIELD`의 Prisma 반환 타입
 */
export type ReviewSelectField = Prisma.ReviewGetPayload<
  typeof REVIEW_SELECT_FIELD
>;
