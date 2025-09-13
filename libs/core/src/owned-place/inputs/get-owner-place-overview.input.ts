/**
 * 사장님 장소 개요 조회 입력 input
 *
 * @publicApi
 */
export class GetOwnerPlaceOverviewInput {
  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;
}
