export class CreateReviewInput {
  /**
   * 장소 식별자
   */
  placeIdx: number;

  /**
   * 작성자 식별자
   */
  userIdx: number;

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
