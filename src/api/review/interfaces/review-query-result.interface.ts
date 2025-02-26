export interface ReviewQueryResult {
  idx: number;
  userIdx: number;
  placeIdx: number;
  content: string;
  createdAt: Date;
  reviewImage: { imagePath: string | null }[];
  reviewKeywordMapping: { keyword: { content: string } }[];
}
