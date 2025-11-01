/**
 * magazine 시드 입력 타입 정의
 *
 * @publicApi
 */
export type MagazineSeedInput = {
  title?: string;
  description?: string;
  content?: string;
  thumbnailPath?: string | null;
  /**
   * @default false
   */
  isTitleVisible?: boolean;
  /**
   * @default 0
   */
  likeCount?: number;
  /**
   * @default 0
   */
  viewCount?: number;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
  placeIdxList?: [number, ...number[]] | null;
};
