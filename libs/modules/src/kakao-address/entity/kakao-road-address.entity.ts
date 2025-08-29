/**
 * 카카오 주소 검색 API에서 정의한 도로명 주소
 *
 * @author 강정연
 */
export class KakaoRoadAddressEntity {
  /**
   * 전체 도로명 주소
   *
   * @example "전북 익산시 망산길 11-17"
   */
  address_name: string;

  /**
   * 지역명1
   *
   * @example "전북"
   */
  region_1depth_name: string;

  /**
   * 지역명2
   *
   * @example "익산시"
   */
  region_2depth_name: string;

  /**
   * 지역명3
   *
   * @example "부송동"
   */
  region_3depth_name: string;

  /**
   * 도로명
   *
   * @example "망산길"
   */
  road_name: string;

  /**
   * 지하 여부, Y 또는 N
   *
   * @example "N"
   */
  underground_yn: 'Y' | 'N';

  /**
   * 건물 본번
   *
   * @example "11"
   */
  main_building_no: string;

  /**
   * 건물 부번, 없을 경우 빈 문자열("")
   *
   * @example "17"
   */
  sub_building_no: string;

  /**
   * 건물 이름
   *
   * @example ""
   */
  building_name: string;

  /**
   * 우편번호(5자리)
   *
   * @example "54547"
   */
  zone_no: string;

  /**
   * Y 좌표값, 경위도인 경우 위도(latitude)
   *
   * @example "35.976749396987046"
   */
  y: string;

  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   *
   * @example "126.99599512792346"
   */
  x: string;
}
