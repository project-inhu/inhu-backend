/**
 * Controller -> Service로 전달되는 리뷰 생성 DTO
 *
 * @author 강정연
 */
export class CreateReviewByPlaceIdxInput {
  placeIdx: number;
  content: string;
  imagePathList?: string[];
  keywordIdxList?: number[];
}
