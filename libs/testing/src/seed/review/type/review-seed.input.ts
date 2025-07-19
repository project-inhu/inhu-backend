export type ReviewSeedInput = {
  userIdx: number;
  placeIdx: number;
  deletedAt?: Date | null;
  content?: string;
  reviewImgList?: [string, ...string[]] | null;
  keywordIdxList?: [number, ...number[]] | null;
};
