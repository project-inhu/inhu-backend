import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 유저 정보 수정 Dto
 *
 * @author 조희주
 */

export class UpdateUserDto {
  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  nickname?: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/user123/profile.jpg"
   */
  @IsOptional()
  @IsString()
  profileImagePath?: string | null;
}
