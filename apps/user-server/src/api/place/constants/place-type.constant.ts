export const PLACE_TYPE = {
  CAFE: 1,
  RESTAURANT: 2,
  BAR: 3,
} as const;

export type PlaceType = (typeof PLACE_TYPE)[keyof typeof PLACE_TYPE];
