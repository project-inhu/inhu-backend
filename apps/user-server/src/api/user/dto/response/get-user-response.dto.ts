/**
 * 유저 정보 Response Dto
 *
 * @author 조희주
 */

export class GetUserResponseDto {
  /**
   * 사용자 고유 idx
   *
   * @example 1
   */
  idx: number;

  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/profile/myprofile.jpg"
   */
  profileImagePath: string | null;

  /**
   * 계정 생성일
   *
   * @example "2025-03-07T08:50:21.451Z"
   */
  createdAt: Date;

  /**
   * 권한 인증처
   *
   * @example "kakao"
   */
  provider?: string;
}
