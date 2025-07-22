import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * 사용자 정보 수정 입력 DTO
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
   * @example "/profile/1234c567-89d7-012c-34f0-56789a01a234-cat.jpg"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profileImagePath?: string | null;
}
