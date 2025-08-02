/**
 * 모든 사용자 목록 조회를 위한 input
 *
 * @author 조희주
 * @publicApi
 */
export class GetAllUsersInput {
  /**
   * 건너뛸 데이터의 개수 (페이지네이션용)
   */
  skip: number;

  /**
   * 가져올 데이터의 개수 (페이지네이션용)
   */
  take: number;
}
