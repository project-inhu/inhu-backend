import { IsOptional, IsString, Length } from 'class-validator';

/**
 * 내 정보 DTO
 *
 * @author 조희주
 */
export class MyInfoDto {
  /**
   * 사용자 닉네임
   * @example "heeju"
   */
  @IsString()
  @IsOptional()
  @Length(1, 15)
  nickname?: string;

  /**
   * 프로필 이미지 경로
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com/user123/profile.jpg"
   * @nullable true
   */
  @IsOptional()
  @IsString()
  profileImagePath?: string | null;
}
