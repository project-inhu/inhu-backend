/**
 * Menu 시드 입력 타입 정의
 *
 * @publicApi
 */
export type MenuSeedInput = {
  placeIdx: number;

  name?: string;

  content?: string | null;

  price?: number | null;

  imagePath?: string | null;

  /**
   * @default false
   */
  isFlexible?: boolean;

  sortOrder?: number | null;

  deletedAt?: Date | null;
};
