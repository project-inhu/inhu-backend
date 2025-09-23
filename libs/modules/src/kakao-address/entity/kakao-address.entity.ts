/**
 * 카카오 주소 검색 API에서 정의한 Address 엔티티
 *
 * @author 강정연
 */
export class KakaoAddressEntity {
  /**
   * 전체 지번 주소
   *
   * @example "전북 익산시 부송동 100"
   */
  address_name: string;

  /**
   * 지역 1 Depth, 시도 단위
   *
   * @example 전북
   */
  region_1depth_name: string;

  /**
   * 지역 2 Depth, 구 단위
   *
   * @example 익산시
   */
  region_2depth_name: string;

  /**
   * 지역 3 Depth, 동 단위
   *
   * @example 부송동
   */
  region_3depth_name: string;

  /**
   * 지역 3 Depth, 행정동 명칭
   *
   * @example 삼성동
   */
  region_3depth_h_name: string;

  /**
   * 행정 코드
   *
   * @example 4514069000
   */
  h_code: string;

  /**
   * 법정 코드
   *
   * @example 4514013400
   */
  b_code: string;

  /**
   * 산 여부, Y 또는 N
   *
   * @example Y
   */
  mountain_yn: 'Y' | 'N';

  /**
   * 지번 주번지
   *
   * @example 100
   */
  main_address_no: string;

  /**
   * 지번 부번지, 없을 경우 빈 문자열("") 반환
   *
   * @example ""
   */
  sub_address_no: string;

  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   *
   * @example "126.99597295767953"
   */
  x: string;

  /**
   * Y 좌표값, 경위도인 경우 위도(latitude)
   *
   * @example "35.97664845766847"
   */
  y: string;
}
