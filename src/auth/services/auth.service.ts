import { Injectable } from '@nestjs/common';
import { LoginTokenService } from '../services/login-token.service';
import { ISocialAuthStrategy } from '../strategies/social-login/interfaces/social-auth-base.strategy';
import { KakaoStrategy } from '../strategies/social-login/kakao/kakao.strategy';
import { TokenStorageStrategy } from '../strategies/storages/base/token-storage.strategy';
import { AppleStrategy } from '../strategies/social-login/apple/apple.strategy';
import {
  AUTH_PROVIDERS,
  AuthProviderValue,
} from '../common/constants/auth-provider.constant';
import { CreateUserEntity } from 'src/api/user/entity/create-user.entity';

@Injectable()
export class AuthService {
  private readonly SOCIAL_LOGIN_MAP: Record<
    AuthProviderValue,
    ISocialAuthStrategy
  >;

  constructor(
    private readonly kakaoAuthService: KakaoStrategy,
    private readonly appleAuthService: AppleStrategy,
    private readonly loginTokenService: LoginTokenService,
    private readonly tokenStorage: TokenStorageStrategy,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AUTH_PROVIDERS.KAKAO.name]: this.kakaoAuthService,
      [AUTH_PROVIDERS.APPLE.name]: this.appleAuthService,
    };
  }

  /**
   * 로그인 provider에 해당하는 social strategy 반환
   *
   * @author 조희주
   */
  public getSocialAuthStrategy(
    provider: AuthProviderValue,
  ): ISocialAuthStrategy {
    return this.SOCIAL_LOGIN_MAP[provider];
  }

  public async generateTokenPairWithSocialAuth(
    user: CreateUserEntity,
  ): Promise<TokenPair> {
    const payload = { idx: user.idx };
    const jwtAccessToken =
      await this.loginTokenService.signAccessToken(payload);
    const jwtRefreshToken =
      await this.loginTokenService.signRefreshToken(payload);

    this.tokenStorage.saveRefreshToken(user.idx, jwtRefreshToken);

    return { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
  }

  /**
   * 소셜 로그인 인증 코드(code)를 사용하여 사용자 인증 후 토큰 발급
   *
   * @author 조희주
   */
  public async login(
    provider: AuthProviderValue,
    dto: any,
  ): Promise<TokenPair> {
    return this.generateTokenPairWithSocialAuth(
      await this.getSocialAuthStrategy(provider).login(dto),
    );
  }

  /**
   * Kakao SDK를 사용하여 로그인
   */
  public async sdkLogin(token: string): Promise<TokenPair> {
    return this.generateTokenPairWithSocialAuth(
      await this.kakaoAuthService.sdkLogin(token),
    );
  }

  public async regenerateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    return this.tokenStorage.regenerateAccessTokenFromRefreshToken(
      refreshToken,
    );
  }
}
