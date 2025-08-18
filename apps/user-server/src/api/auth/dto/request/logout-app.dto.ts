import { IsString } from 'class-validator';

export class LogoutAppDto {
  /**
   * token type이 포함된 refresh token
   *
   * @example "Bearer this.is.token"
   */
  @IsString()
  public refreshTokenWithType: string;
}
