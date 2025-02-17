import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialAuthStrategy } from '../base/social-auth.strategy';
import { UserPayloadInfoDto } from '../../dto/user-payload-info.dto';
import axios from 'axios';
import {
  AuthProvider,
  getAuthProviderNumber,
} from '../../enum/auth-provider.enum';
import { kakaoToken } from './dto/kakao-token.interface';
import { KakaoUserInfo } from './dto/kakao-user-info.interface';

@Injectable()
export class kakaoAuthStrategy extends SocialAuthStrategy<
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
      provider: getAuthProviderNumber(AuthProvider.KAKAO),
    };
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    const response = await axios.get<KakaoUserInfo>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('fail');
    }

    return response.data;
  }
}
