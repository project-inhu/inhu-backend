import { IsString } from 'class-validator';

export class ReissueAccessTokenAppDto {
  @IsString()
  refreshTokenWithType: string;
}
