import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';

export abstract class SocialAuthBaseStrategy<TToken = any, TUserInfo = any> {
  protected abstract authLoginUrl: string;
  protected abstract tokenUrl: string;
  protected abstract getTokenParams(code: string): Record<string, string>;

  abstract getAuthLoginUrl(): string;
  abstract getAccessToken(token: TToken): string;
  abstract getUserInfo(accessToken: string): Promise<TUserInfo>;
  abstract extractUserInfo(userInfo: TUserInfo): SocialUserInfoDto;

  async getToken(code: string): Promise<TToken> {
    const params = this.getTokenParams(code);

    const response = await axios.post<TToken>(
      this.tokenUrl,
      new URLSearchParams(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    if (!response?.data) {
      throw new UnauthorizedException('토큰 발급 실패');
    }

    return response.data;
  }
}
