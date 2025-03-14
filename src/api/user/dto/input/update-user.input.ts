import { IsOptional, IsString } from 'class-validator';

/**
 * 사용자 정보 수정을 위한 입력 값
 *
 * @author 조희주
 */
export class UpdateUserInput {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  profileImagePath?: string | null;
}
