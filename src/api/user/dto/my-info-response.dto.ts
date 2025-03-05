/**
 * 내 정보 응답 DTO
 *
 * @author 조희주
 */

export class MyInfoResponseDto {
  idx: number;
  nickname: string;
  profileImagePath: string | null;
  createdAt: Date;
  deletedAt?: Date | null;
}
