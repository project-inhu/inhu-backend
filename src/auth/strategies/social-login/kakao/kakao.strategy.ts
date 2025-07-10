import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISocialAuthStrategy } from '../interfaces/social-auth-base.strategy';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { ConfigService } from '@nestjs/config';
import { SocialTokenService } from '../services/social-token.service';
import { Request } from 'express';

/**
 * Kakao OAuth 인증 전략
 * - `ISocialAuthStrategy`를 구현하여 카카오 로그인 기능을 구현함
 * - 카카오 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class KakaoStrategy
  implements ISocialAuthStrategy<KakaoTokenDto, KakaoUserInfoDto>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly socialTokenService: SocialTokenService<KakaoTokenDto>,
  ) {}

  private getSocialTokenParams(code: string): Record<string, string> {
    return {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') ?? '',
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URI') ?? '',
      code: encodeURIComponent(code),
    };
  }

  private async getUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    const response = await axios.get<KakaoUserInfoDto>(
      this.configService.get<string>('KAKAO_USER_INFO_URL') ?? '',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    if (!response?.data) {
      throw new UnauthorizedException('Failed to fetch information');
    }

    return response.data;
  }

  private mapToSocialUserInfo(userInfo: KakaoUserInfoDto): SocialUserInfoDto {
    return { snsId: userInfo.id.toString(), provider: AuthProvider.KAKAO };
  }

  public extractCodeFromRequest(req: Request): string {
    const query = req.query as KakaoCallBackQuery;
    const code = query.code;
    if (!code) {
      throw new BadRequestException(
        'Kakao authorization code not found in request query',
      );
    }
    return code;
  }

  public getAuthLoginUrl(): string {
    return (
      this.configService.get<string>('KAKAO_AUTH_URL') +
      '?response_type=code&' +
      `redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URI')}&` +
      `client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}`
    );
  }

  public async login(code: string): Promise<SocialUserInfoDto> {
    const socialToken = await this.socialTokenService.requestSocialToken(
      this.getSocialTokenParams(code),
      this.configService.get<string>('KAKAO_TOKEN_URL') ?? '',
    );
    const userInfo = await this.getUserInfo(socialToken.access_token);
    return this.mapToSocialUserInfo(userInfo);
  }

  public async sdkLogin(accessToken: string): Promise<SocialUserInfoDto> {
    const userInfo = await this.getUserInfo(accessToken);
    return this.mapToSocialUserInfo(userInfo);
  }
}
