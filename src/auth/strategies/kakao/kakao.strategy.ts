import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SocialAuthBaseStrategy } from '../base/social-auth-base.strategy';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { ConfigService } from '@nestjs/config';

/**
 * 카카오 OAuth 인증 전략
 * - `SocialAuthBaseStrategy`를 상속하여 카카오 로그인 기능을 구현함
 * - 카카오 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class KakaoStrategy extends SocialAuthBaseStrategy<
  KakaoTokenDto,
  KakaoUserInfoDto
> {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  protected authLoginUrl =
    this.configService.get<string>('KAKAO_AUTH_URL') +
    '?response_type=code&' +
    `redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URI')}&` +
    `client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}`;

  protected tokenUrl = this.configService.get<string>('KAKAO_TOKEN_URL') ?? '';

  /**
   * 인가코드를 통해 액세스 토큰을 발급하는 메서드
   */
  protected getTokenParams(code: string): Record<string, string> {
    return {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID ?? '',
      redirect_uri: process.env.KAKAO_REDIRECT_URI ?? '',
      code: code,
    };
  }

  public getAuthLoginUrl(): string {
    return this.authLoginUrl;
  }

  public getAccessToken(token: KakaoTokenDto): string {
    return token.access_token;
  }

  public extractUserInfo(userInfo: KakaoUserInfoDto): SocialUserInfoDto {
    return { id: userInfo.id.toString(), provider: AuthProvider.KAKAO };
  }

  public async getUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
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
}
