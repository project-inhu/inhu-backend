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
 *
 * @author 이수인
 */
export abstract class SocialAuthBaseStrategy<TToken = any, TUserInfo = any> {
  /**
   * 인증을 요청하는 URL
   * - 사용자가 로그인 버튼을 클릭하면 이 URL로 이동하여 소셜 로그인 진행
   */
  protected abstract authLoginUrl: string;

  /**
   * 액세스 토큰을 요청하는 URL
   * - 사용자가 로그인 후 인가 코드(code)를 이용해 토큰을 발급받는 엔드포인트
   */
  protected abstract tokenUrl: string;

  /**
   * 액세스 토큰 요청에 필요한 파라미터를 반환
   * - 각 소셜 로그인 서비스마다 요구하는 파라미터가 다르므로, 구체적인 구현 필요
   *
   * @param code 소셜 로그인에서 제공하는 인가 코드 (authorization code)
   * @returns 토큰 요청에 필요한 파라미터 객체
   */
  protected abstract getTokenParams(code: string): Record<string, string>;

  /**
   * 소셜 로그인 인증 페이지 URL을 반환
   * - 사용자가 로그인 버튼을 클릭하면 이 URL로 이동하여 인증 진행
   *
   * @returns 소셜 로그인 인증 URL
   */
  public abstract getAuthLoginUrl(): string;

  /**
   * 액세스 토큰을 추출하는 메서드
   * - 소셜 로그인 응답에서 액세스 토큰을 가져옴
   *
   * @param token 소셜 로그인에서 반환된 토큰 객체
   * @returns 액세스 토큰 문자열
   */
  public abstract getAccessToken(token: TToken): string;

  /**
   * 액세스 토큰을 이용해 사용자 정보를 가져오는 메서드
   * - 각 소셜 서비스별 API를 호출하여 사용자 정보를 가져옴
   *
   * @param accessToken 소셜 로그인에서 발급받은 액세스 토큰
   * @returns 사용자 정보 객체 (TUserInfo 타입)
   */
  public abstract getUserInfo(accessToken: string): Promise<TUserInfo>;

  /**
   * 소셜 로그인 사용자 정보를 공통 DTO 형식으로 변환
   * - 서비스별로 다른 사용자 정보 구조를 `SocialUserInfoDto` 형태로 통합
   *
   * @param userInfo 소셜 로그인에서 제공한 원본 사용자 정보
   * @returns 변환된 사용자 정보 DTO
   */
  public abstract extractUserInfo(userInfo: TUserInfo): SocialUserInfoDto;

  /**
   * 소셜 로그인에서 발급한 액세스 토큰을 요청하는 메서드
   * - `getTokenParams()`에서 생성된 파라미터를 이용해 소셜 로그인 서버에서 토큰을 요청함
   *
   * @param code 소셜 로그인에서 제공한 인가 코드 (authorization code)
   * @returns 소셜 로그인에서 반환된 토큰 객체 (TToken 타입)
   * @throws UnauthorizedException 토큰 발급 실패 시 예외 발생
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
