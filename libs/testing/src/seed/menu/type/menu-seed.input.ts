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

  deletedAt?: Date | null;
};
