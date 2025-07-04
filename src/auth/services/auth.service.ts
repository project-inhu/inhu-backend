import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider } from '../enums/auth-provider.enum';
import { LoginTokenService } from '../services/login-token.service';
import { SocialAuthBaseStrategy } from '../strategies/base/social-auth-base.strategy';
import { KakaoStrategy } from '../strategies/kakao/kakao.strategy';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class AuthService {
  private readonly SOCIAL_LOGIN_MAP: Record<
    AuthProvider,
    SocialAuthBaseStrategy
  >;

  /**
   * Refresh Token을 서버 메모리에서 관리 (DB 저장 X)
   * - key: userIdx
   * - value: refreshToken (string)
   */
  private readonly REFRESH_TOKEN_STORE: Record<number, string> = {};

  constructor(
    private readonly kakaoAuthService: KakaoStrategy,
    private readonly loginTokenService: LoginTokenService,
    private readonly userService: UserService,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
    };
  }

  /**
   * 로그인 provider에 해당하는 social strategy 반환
   *
   * @author 조희주
   */
  public getSocialAuthStrategy(provider: AuthProvider): SocialAuthBaseStrategy {
    return this.SOCIAL_LOGIN_MAP[provider];
  }

  /**
   * Refresh Token 메모리에 저장
   *
   * @author 조희주
   */
  public saveRefreshToken(userIdx: number, refreshToken: string): void {
    this.REFRESH_TOKEN_STORE[userIdx] = refreshToken;
  }

  /**
   * Refresh Token 조회
   *
   * @author 조희주
   */
  public getRefreshToken(userIdx: number): string | null {
    return this.REFRESH_TOKEN_STORE[userIdx] || null;
  }

  public async generateTokenPairWithSocialAuth(
    socialAuthService: SocialAuthBaseStrategy,
    accessToken: string,
  ): Promise<TokenPair> {
    const userInfo = await socialAuthService.getUserInfo(accessToken);
    const extractedUserInfo = socialAuthService.extractUserInfo(userInfo);

    const user = await this.userService.createUser(extractedUserInfo);

    const payload = { idx: user.idx };
    const jwtAccessToken =
      await this.loginTokenService.signAccessToken(payload);
    const jwtRefreshToken =
      await this.loginTokenService.signRefreshToken(payload);

    this.saveRefreshToken(user.idx, jwtRefreshToken);

    return { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
  }

  /**
   * 소셜 로그인 인증 코드(code)를 사용하여 사용자 인증 후 토큰 발급
   *
   * @author 조희주
   */
  public async login(provider: AuthProvider, code: string): Promise<TokenPair> {
    const socialAuthService = this.getSocialAuthStrategy(provider);

    const authToken = await socialAuthService.getToken(code);
    const accessToken = socialAuthService.getAccessToken(authToken);
    return this.generateTokenPairWithSocialAuth(socialAuthService, accessToken);
  }

  /**
   * Kakao SDK를 사용하여 로그인
   */
  public async sdkLogin(accessToken: string): Promise<TokenPair> {
    const socialAuthService = this.getSocialAuthStrategy(AuthProvider.KAKAO);

    return this.generateTokenPairWithSocialAuth(socialAuthService, accessToken);
  }

  /**
   * Refresh Token 검증 후 새로운 Access Token 발급
   *
   * @author 조희주
   */
  public async regenerateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ newAccessToken: string; payload: RefreshTokenPayload }> {
    const payload =
      await this.loginTokenService.verifyRefreshToken(refreshToken);

    return {
      newAccessToken: await this.loginTokenService.signAccessToken(payload),
      payload,
    };
  }
}
