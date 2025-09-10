/**
 * 사장님 시드 입력 타입 정의
 *
 * @publicApi
 */
export type PlaceOwnerSeedInput = {
  userIdx: number;
  placeIdx: number;
  deletedAt?: Date | null;
};
