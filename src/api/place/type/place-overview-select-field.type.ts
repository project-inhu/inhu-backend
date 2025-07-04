import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 place overview 데이터
 *
 * `PlaceOverviewEntity`로 변환되기 전의 원시 데이터
 *
 * @author 이수인
 */
const PLACE_OVERVIEW_SELECT_FIELD = Prisma.validator<Prisma.PlaceDefaultArgs>()(
  {
    select: {
      idx: true,
      name: true,
      address: true,
      reviewCount: true,
      bookmark: {
        select: {
          idx: true,
        },
      },
      placeImage: {
        select: {
          path: true,
        },
      },
    },
  },
);

/**
 * `PLACE_OVERVIEW_SELECT_FIELD`의 Prisma 반환 타입
 *
 * @author 이수인
 */
export type PlaceOverviewSelectField = Prisma.PlaceGetPayload<
  typeof PLACE_OVERVIEW_SELECT_FIELD
>;
