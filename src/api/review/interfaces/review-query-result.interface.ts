/**
 * Prisma에서 조회된 리뷰 데이터
 *
 * `ReviewEntity`로 변환되기 전의 원시 데이터
 *
 * @author 강정연
 */
export interface ReviewQueryResult {
  idx: number;
  userIdx: number;
  placeIdx: number;
  content: string;
  createdAt: Date;
  reviewImage: { imagePath: string | null }[];
  reviewKeywordMapping: { keyword: { content: string } }[];
  user: { nickname: string };
  place: { name: string };
}
