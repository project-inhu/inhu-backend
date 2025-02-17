import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';

/**
 * 소셜 로그인 인증을 위한 기본 전략(Abstract Class)
 *
 * - 각 소셜 로그인 제공자(Kakao, Apple 등)에 대한 공통된 로직을 정의
 * - 각 소셜 로그인 제공자는 이 클래스를 상속하여 구현해야 함
 * - 토큰 발급, 사용자 정보 조회, 로그인 URL 제공 등의 메서드를 추상 메서드로 선언
 *
 * @template TToken 소셜 로그인 제공자가 반환하는 토큰 데이터 타입 (ex: KakaoTokenDto)
 * @template TUserInfo 소셜 로그인 제공자가 반환하는 사용자 정보 데이터 타입 (ex: KakaoUserInfo)
 */
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
