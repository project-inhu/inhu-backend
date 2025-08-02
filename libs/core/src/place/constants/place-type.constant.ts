/**
 * 장소 타입 상수
 *
 * @publicApi
 */
export const PLACE_TYPE = {
  CAFE: 1,
  RESTAURANT: 2,
  BAR: 3,
} as const;

/**
 * 장소 타입
 *
 * @publicApi
 */
export type PlaceType = (typeof PLACE_TYPE)[keyof typeof PLACE_TYPE];
