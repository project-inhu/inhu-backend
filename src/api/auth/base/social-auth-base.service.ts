import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { SocialUserInfoDto } from '../dto/social-common/social-user-info.dto';

export abstract class SocialAuthBaseService<TToken, TUserInfo> {
  protected abstract authLoginUrl: string;
  protected abstract tokenUrl: string;
  protected abstract getTokenParams(code: string): Record<string, string>;

  abstract getAuthLoginUrl(): string;
  abstract getAccessToken(token: TToken): string;
  abstract getUserInfo(accessToken: string): Promise<TUserInfo>;
  abstract extractUserInfo(userInfo: TUserInfo): SocialUserInfoDto;

  async getToken(code: string): Promise<TToken> {
    const params = this.getTokenParams(code);

    try {
      const response = await axios.post<TToken>(
        this.tokenUrl,
        new URLSearchParams(params),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      if (!response?.data) {
        throw new UnauthorizedException('토큰 발급 실패');
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Something is wrong');
    }
  }
}
