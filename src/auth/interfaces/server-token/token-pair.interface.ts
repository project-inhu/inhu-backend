/**
 * 토큰 페어(Token Pair) 인터페이스
 * - 소셜 로그인 또는 인증 과정에서 생성된 `accessToken`과 `refreshToken`을 포함하는 객체
 * - 사용자가 인증을 성공하면 이 인터페이스를 반환
 *
 * @property {string} accessToken - 인증된 사용자의 액세스 토큰 (JWT)
 * @property {string} refreshToken - 새로운 액세스 토큰을 발급받기 위한 리프레시 토큰 (JWT)
 *
 * @author 조희주
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
