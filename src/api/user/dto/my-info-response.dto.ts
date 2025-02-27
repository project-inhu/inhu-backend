/**
 * 내 정보 조회 응답 DTO
 * - 사용자 프로필 정보(닉네임, 프로필 이미지)를 반환
 *
 * @author 조희주
 */

export class MyInfoResponseDto {
  nickname: string;
  profileImagePath: string | null;
}
