import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserPayloadInfoDto } from '../dto/user-payload-info.dto';

@Injectable()
export abstract class SocialAuthService<TToken, TUserInfo> {
  protected abstract tokenUrl: string;
  protected abstract getTokenParams(code: string): Record<string, string>;

  abstract getUserInfo(accessToken: string): Promise<TUserInfo>;
  abstract extractUserInfo(userInfo: TUserInfo): UserPayloadInfoDto;

  async getToken(code: string): Promise<TToken> {
    const payload = new URLSearchParams(this.getTokenParams(code));

    const response = await axios.post<TToken>(this.tokenUrl, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.status !== 200) {
      throw new Error('fail');
    }

    return response.data;
  }
}
