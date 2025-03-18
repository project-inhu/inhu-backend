import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 place 데이터
 *
 * `PlaceEntity`로 변환되기 전의 원시 데이터
 *
 * @author 이수인
 */
const PLACE_SELECT_FIELD = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    tel: true,
    address: true,
    addressX: true,
    addressY: true,
    createdAt: true,
    placeHours: {
      select: {
        day: true,
        startAt: true,
        endAt: true,
      },
    },
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
    review: {
      select: {
        idx: true,
      },
    },
  },
});

/**
 * `PLACE_SELECT_FIELD`의 Prisma 반환 타입
 *
 * @author 이수인
 */
export type PlaceSelectField = Prisma.PlaceGetPayload<
  typeof PLACE_SELECT_FIELD
>;
