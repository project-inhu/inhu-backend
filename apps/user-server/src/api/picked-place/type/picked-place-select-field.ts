import { Prisma } from '@prisma/client';
import { PLACE_SELECT_FIELD } from '@user/api/place/type/place-select-field.type';

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
        select: PLACE_SELECT_FIELD.select,
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
