import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 place overview 데이터
 *
 * `PlaceOverviewEntity`로 변환되기 전의 원시 데이터
 *
 * @author 강정연
 *
 * @deprecated
 */
export const PLACE_OVERVIEW_SELECT_FIELD =
  Prisma.validator<Prisma.PlaceDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      roadAddress: {
        select: {
          addressName: true,
          detailAddress: true,
        },
      },
      reviewCount: true,
      placeKeywordCountList: {
        take: 2,
        orderBy: [{ count: 'desc' }, { keyword: { idx: 'asc' } }],
        select: {
          count: true,
          keyword: {
            select: {
              content: true,
              idx: true,
            },
          },
        },
      },
      bookmarkList: {
        select: {
          placeIdx: true,
        },
      },
      placeImageList: {
        orderBy: { idx: 'asc' },
        select: {
          path: true,
        },
      },
      placeTypeMappingList: {
        select: {
          placeType: {
            select: {
              idx: true,
              content: true,
            },
          },
        },
      },
    },
  });

/**
 * `PLACE_OVERVIEW_SELECT_FIELD`의 Prisma 반환 타입
 *
 * @author 강정연
 */
export type PlaceOverviewSelectField = Prisma.PlaceGetPayload<
  typeof PLACE_OVERVIEW_SELECT_FIELD
>;
