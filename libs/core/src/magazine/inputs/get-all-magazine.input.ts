export class GetAllMagazineInput {
  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;

  /**
   * 활성화 필터링
   *
   * - true: 활성화된 장소만
   * - false: 비활성화된 장소만
   * - undefined: 활성화된 장소와 비활성화된 장소 모두 가져오기
   */
  activated?: boolean;
}
