import { IsOptional, IsString, Length } from 'class-validator';

/**
 * 내 정보 DTO
 *
 * @author 조희주
 */
export class MyInfoDto {
  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  @IsOptional()
  @IsString()
  @Length(1, 15)
  nickname?: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "user123/profile.jpg"
   */
  @IsOptional()
  @IsString()
  profileImagePath?: string | null;
}
