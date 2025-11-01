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

  /**
   * 정렬 옵션
   *
   * like = 좋아요 많은 순
   * view = 조회수 높은 순
   * time = 시간순
   */
  orderBy?: 'like' | 'view' | 'time';

  /**
   * 고정된 매거진만 조회 여부
   *
   * - true: 고정된 매거진만
   * - false: 고정되지 않은 매거진만
   * - undefined: 전체 매거진
   */
  pinned?: boolean;
}
