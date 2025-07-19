export type ReviewSeedInput = {
  userIdx: number;
  placeIdx: number;
  deletedAt: Date | null;
  content?: string;
  reviewImgList?: string[];
  keywordIdxList?: number[];
};
