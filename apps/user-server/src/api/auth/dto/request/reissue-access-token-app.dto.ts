import { IsString } from 'class-validator';

export class ReissueAccessTokenAppDto {
  /**
   * token type이 포함된 refresh token
   *
   * @example "Bearer this.is.token"
   */
  @IsString()
  refreshTokenWithType: string;
}
