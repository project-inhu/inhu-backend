import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SocialAuthBaseStrategy } from '../base/social-auth-base.strategy';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';

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
  protected authLoginUrl =
    'https://kauth.kakao.com/oauth/authorize?' +
    'response_type=code&' +
    `redirect_uri=${process.env.KAKAO_REDIRECT_URI}&` +
    `client_id=${process.env.KAKAO_CLIENT_ID}`;

  protected tokenUrl = 'https://kauth.kakao.com/oauth/token';

  protected getTokenParams(code: string): Record<string, string> {
    return {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID ?? '',
      redirect_uri: process.env.KAKAO_REDIRECT_URI ?? '',
      code: code,
    };
  }

  getAuthLoginUrl(): string {
    return this.authLoginUrl;
  }

  getAccessToken(token: KakaoTokenDto): string {
    return token.access_token;
  }

  extractUserInfo(userInfo: KakaoUserInfoDto): SocialUserInfoDto {
    return {
      id: userInfo.id.toString(),
      provider: AuthProvider.KAKAO,
    };
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    const response = await axios.get<KakaoUserInfoDto>(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    if (!response?.data) {
      throw new UnauthorizedException('정보 조회 실패');
    }

    return response.data;
  }
}
