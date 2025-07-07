import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 picked place 데이터
 *
 * `PickedPlaceEntity`로 변환되기 전의 원시 데이터
 *
 * @author 강정연
 */
const PICKED_PLACE_SELECT_FIELD =
  Prisma.validator<Prisma.PickedPlaceDefaultArgs>()({
    select: {
      title: true,
      content: true,
      place: {
        select: {
          idx: true,
          name: true,
          address: true,
          reviewCount: true,
          bookmarkList: {
            select: {
              idx: true,
            },
          },
          placeImageList: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });

/**
 * `PICKED_PLACE_SELECT_FIELD`의 Prisma 반환 타입
 *
 * @author 강정연
 */
export type PickedPlaceSelectField = Prisma.PickedPlaceGetPayload<
  typeof PICKED_PLACE_SELECT_FIELD
>;
