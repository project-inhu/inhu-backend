import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';

/**
 * 소셜 로그인(Kakao, Apple 등) 인증을 위한 기본 전략(추상 클래스)으로, 공통 로직을 정의하며 각 제공자가 이를 상속하여 구현해야 합니다.
 *
 * @template TToken 소셜 로그인 제공자가 반환하는 토큰 데이터 타입 (ex: KakaoTokenDto)
 * @template TUserInfo 소셜 로그인 제공자가 반환하는 사용자 정보 데이터 타입 (ex: KakaoUserInfo)
 *
 * @author 이수인
 */
export abstract class SocialAuthBaseStrategy<TToken = any, TUserInfo = any> {
  /**
   * 소셜 로그인 인증을 요청하는 URL
   *
   * @author 이수인
   */
  protected abstract authLoginUrl: string;

  /**
   * 액세스 토큰을 요청하는 URL
   * - 사용자가 로그인 후 인가 코드(code)를 이용해 토큰을 발급받는 엔드포인트
   *
   * @author 이수인
   */
  protected abstract tokenUrl: string;

  /**
   * 액세스 토큰 요청에 필요한 파라미터를 반환
   *
   * @param code 소셜 로그인에서 제공하는 인가 코드
   *
   * @author 이수인
   */
  protected abstract getTokenParams(code: string): Record<string, string>;

  /**
   * 소셜 로그인 인증 페이지 URL을 반환
   *
   * @author 이수인
   */
  public abstract getAuthLoginUrl(): string;

  /**
   * 소셜 로그인 응답에서 액세스 토큰을 추출
   *
   * @param token 소셜 로그인에서 반환된 토큰 객체
   *
   * @author 이수인
   */
  public abstract getAccessToken(token: TToken): string;

  /**
   * 액세스 토큰을 이용해 소셜 사용자 정보를 조회
   *
   * @param accessToken 소셜 로그인에서 발급받은 액세스 토큰
   *
   * @author 이수인
   */
  public abstract getUserInfo(accessToken: string): Promise<TUserInfo>;

  /**
   * 각 소셜 서비스의 사용자 정보를 공통 DTO(SocialUserInfoDto)로 변환
   *
   * @param userInfo 소셜 로그인에서 제공한 원본 사용자 정보
   *
   * @author 이수인
   */
  public abstract extractUserInfo(userInfo: TUserInfo): SocialUserInfoDto;

  /**
   * 소셜 로그인 제공자로부터 토큰을 요청하는 메서드
   *
   * @param code 소셜 로그인 제공자가 발급한 인가 코드 (authorization code)
   * @throws UnauthorizedException - 토큰 요청 실패 시 예외 발생
   *
   * @author 이수인
   */
  public async getToken(code: string): Promise<TToken> {
    const params = this.getTokenParams(code);

    const response = await axios.post<TToken>(
      this.tokenUrl,
      new URLSearchParams(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    if (!response?.data) {
      throw new UnauthorizedException('Failed to issue token');
    }

    return response.data;
  }
}
