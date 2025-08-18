import { IsString } from 'class-validator';

export class LoginDto {
  /**
   * 관리자 id
   *
   * @example admin1
   */
  @IsString()
  id: string;

  /**
   * 관리자 비밀번호
   *
   * @example admin1!
   */
  @IsString()
  pw: string;
}
