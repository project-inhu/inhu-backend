import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { SocialAuthBaseService } from '../base/social-auth-base.service';
import { KakaoAccessTokenDto } from '../dto/kakao/kakao-access-token.dto';
import { KakaoUserInfoDto } from '../dto/kakao/kakao-user-info.dto';
import { SocialUserInfoDto } from '../dto/social-user.dto';
import axios from 'axios';
import { AuthProvider } from '../enum/auth-provider.enum';

@Injectable()
export class KakaoAuthService extends SocialAuthBaseService<KakaoAccessTokenDto, KakaoUserInfoDto> {
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

  getAccessToken(token: KakaoAccessTokenDto): string {
    return token.access_token;
  }

  extractUserInfo(userInfo: KakaoUserInfoDto): SocialUserInfoDto {
    return {
      id: userInfo.id.toString(),
      provider: AuthProvider.KAKAO,
    };
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    try {
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
        throw new UnauthorizedException('카카오 사용자 정보 조회 실패');
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('카카오 API 호출 중 오류 발생');
    }
  }
}
