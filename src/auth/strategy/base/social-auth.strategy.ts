import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserPayloadInfoDto } from 'src/auth/dto/user-payload-info.dto';

@Injectable()
// 이 정도 any는 어쩔 수 없음
export abstract class SocialAuthStrategy<TToken = any, TUserInfo = any> {
  protected abstract tokenUrl: string;
  protected abstract getTokenParams(code: string): Record<string, string>;

  //public 붙이기기
  abstract getUserInfo(accessToken: string): Promise<TUserInfo>;
  abstract extractUserInfo(userInfo: TUserInfo): UserPayloadInfoDto;
  abstract getLoginUrl(): string;

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
