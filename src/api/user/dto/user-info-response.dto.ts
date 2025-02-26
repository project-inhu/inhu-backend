/**
 * 내 정보 조회 응답 DTO
 * - 사용자 프로필 정보(닉네임, 프로필 이미지)를 반환
 *
 * @author 조희주
 */

// TODO : Get 빼고 rename
export class GetMyInfoResponseDto {
  profileImagePath: string | null;
  nickname: string;
}
