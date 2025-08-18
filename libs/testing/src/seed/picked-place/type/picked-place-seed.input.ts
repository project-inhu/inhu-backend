/**
 * Picked place 시드 입력 타입 정의
 *
 * @publicApi
 */
export type PickedPlaceSeedInput = {
  placeIdx: number;
  title?: string;
  content?: string;
  deletedAt?: Date | null;
};
