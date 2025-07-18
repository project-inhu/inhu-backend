import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

/**
 * 소셜 로그인 토큰 발급 서비스
 *
 * @author 이수인
 */

@Injectable()
export class SocialTokenService<TToken = any> {
  public async requestSocialToken(
    params: Record<string, string>,
    socialTokenUrl: string,
  ): Promise<TToken> {
    console.log('8. params in social-token.service.ts:', params);
    console.log(
      '9. socialTokenUrl in social-token.service.ts:',
      socialTokenUrl,
    );
    const response = await axios.post<TToken>(
      socialTokenUrl,
      new URLSearchParams(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    if (!response?.data) {
      throw new UnauthorizedException('Failed to issue token');
    }

    return response.data;
  }
}
