/**
 * 애플에서 받아온 사용자 정보 구조를 정의하는 DTO
 *
 * @author 이수인
 */

class AppleDecodedDto {
  /**
   * 토큰 발급자
   * https://appleid.apple.com 으로 고정
   */
  iss: string;

  /**
   * 토큰 수신자 (client_id)
   */
  aud: string;

  /**
   * 토큰이 만료되는 시간 (Unix timestamp)
   */
  exp: number;

  /**
   * 토큰이 발급된 사간 (Unix timestamp)
   */
  iat: number;

  /**
   * 사용자의 고유 식별자
   */
  sub: string;

  /**
   * 재전송 공격을 방지하기 위해 사용하는 임의의 문자열
   */
  nonce: string;

  /** */
  at_hash: string;

  /** */
  auth_time: number;

  /**
   * nonce 지원 여부
   */
  nonce_supported: boolean;

  /**
   * 사용자의 이메일 주소
   */
  email?: string;

  /**
   * apple이 해당 이메일 주소를 확인했는지 여부
   */
  email_verified?: boolean | string;

  /**
   * 이메일이 비공개 가상 주소인지 여부
   */
  is_private_email?: boolean | string;

  /**
   * 사용자가 실제 사람인지에 대한 신뢰도 점수. 사기 방지용
   */
  real_user_status?: number;

  /**
   * 앱을 다른 개발자 팀으로 이전할 때 사용자를 마이그레이션하기 위한 식별자
   */
  transfer_sub?: string;
}
