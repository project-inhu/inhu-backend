/**
 * 카카오 OAuth 인증 후 반환되는 토큰 정보를 담는 DTO
 *
 * @author 이수인
 */

export class GetKakaoTokenResponseDto {
  /**
   * 사용자 액세스 토큰 값
   */
  access_token: string;
  /**
   * 토큰 타입, bearer로 고정
   */
  token_type: string;
  /**
   * 사용자 리프레시 토큰 값
   */
  refresh_token: string;
  /**
   * 액세스 토큰과 ID 토큰의 만료 시간(초)
   *
   * 참고: 액세스 토큰과 ID 토큰의 만료 시간은 동일
   */
  expires_in: number;
  /**
   * 인증된 사용자의 정보 조회 권한 범위
   * 범위가 여러 개일 경우, 공백으로 구분
   *
   * 참고: OpenID Connect가 활성화된 앱의 토큰 발급 요청인 경우, ID 토큰이 함께
   * 발급되며 scope 값에 openid 포함
   */
  scope?: string;
  /**
   * 리프레시 토큰 만료 시간(초)
   */
  refresh_token_expires_in: number;
  /**
   * ID 토큰 값
   * OpenID Connect 확장 기능을 통해 발급되는 ID 토큰, Base64 인코딩 된 사용자 인증 정보 포함
   *
   * 제공 조건: OpenID Connect가 활성화 된 앱의 토큰 발급 요청인 경우
   * 또는 scope에 openid를 포함한 추가 항목 동의 받기 요청을 거친 토큰 발급 요청인 경우
   */
  id_token?: string;
}
