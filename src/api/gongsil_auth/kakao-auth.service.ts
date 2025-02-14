import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialAuthService } from './social-auth.service';
import axios from 'axios';
import { UserPayloadInfoDto } from './user-payload-info.dto';

@Injectable()
export class kakaoAuthService extends SocialAuthService<
  kakaoToken,
  KakaoUserInfo
> {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  protected tokenUrl = 'https://kauth.kakao.com/oauth/token';

  protected getTokenParams(code: string): Record<string, string> {
    return {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') || '',
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URL') || '',
      code: code,
    };
  }

  getLoginUrl(): string {
    return `https://kauth.kakao.com/oauth/authorize?response_type=code
            &client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}
            &redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URL')}`;
  }

  extractUserInfo(userInfo: KakaoUserInfo): UserPayloadInfoDto {
    return {
      id: userInfo.id.toString(),
      provider: 0,
    };
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    const response = await axios.get<KakaoUserInfo>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
