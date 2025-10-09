/**
 * magazine 시드 입력 타입 정의
 *
 * @publicApi
 */
export type MagazineSeedInput = {
  title?: string;
  content?: string;
  thumbnailPath?: string | null;
  /**
   * @default false
   */
  isTitleVisible?: boolean;
  deletedAt?: Date | null;
  placeIdxList?: [number, ...number[]] | null;
};
