/**
 * Controller -> Service로 전달되는 리뷰 수정 input
 *
 * @author 강정연
 */
export class UpdateReviewByReviewIdxInput {
  reviewIdx: number;
  userIdx: number;
  content: string;
  imagePathList?: string[];
  keywordIdxList?: number[];
}
