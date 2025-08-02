/**
 * 리뷰 생성 입력 input
 *
 * @publicApi
 */
export class CreateReviewInput {
  /**
   * 리뷰 내용
   */
  content: string;

  /**
   * 이미지 리스트 목록
   */
  imagePathList: string[];

  /**
   * 키워드 리스트 목록
   */
  keywordIdxList: number[];
}
