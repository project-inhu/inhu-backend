/**
 * 애플 OAuth 인증 후 반환되는 토큰 정보를 담는 DTO
 *
 * @author 이수인
 */

class AppleTokenDto {
  /**
   * 사용자 액세스 토큰 값
   */
  access_token: string;
  /**
   * 토큰 타입, bearer로 고정
   */
  token_type: string;
  /**
   * 액세스 토큰과 ID 토큰의 만료 시간(초)
   */
  expires_in: number;
  /**
   * 사용자 리프레시 토큰 값
   */
  refresh_token: string;
  /**
   * 사용자 식별 정보가 담긴 jwt
   */
  id_token: string;
}
