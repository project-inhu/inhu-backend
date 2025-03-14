import { IsNotEmpty, IsString, isString } from 'class-validator';

/**
 * 소셜 로그인 후 사용자 등록을 위한 input
 *
 * @author 조희주
 */
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  snsId: string;

  @IsNotEmpty()
  @IsString()
  provider: string;
}
