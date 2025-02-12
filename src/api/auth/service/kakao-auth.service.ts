import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SocialAuthBaseService } from '../base/social-auth-base.service';
import axios from 'axios';
import { AuthProvider } from '../enum/auth-provider.enum';
import { SocialUserInfoDto } from '../dto/social-common/social-user-info.dto';

@Injectable()
export class KakaoAuthService extends SocialAuthBaseService<
  KakaoToken,
  KakaoUserInfo
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

  getAccessToken(token: KakaoToken): string {
    return token.access_token;
  }

  extractUserInfo(userInfo: KakaoUserInfo): SocialUserInfoDto {
    return {
      id: userInfo.id.toString(),
      provider: AuthProvider.KAKAO,
    };
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const response = await axios.get<KakaoUserInfo>(
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
    } catch (error) {
      throw new InternalServerErrorException('Something is wrong!!');
    }
  }
}
