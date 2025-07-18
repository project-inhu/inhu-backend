export class GetMenuAllInput {
  /**
   * 장소 식별자
   */
  placeIdx: number;

  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;
}
