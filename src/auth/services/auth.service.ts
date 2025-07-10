import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../enums/auth-provider.enum';
import { LoginTokenService } from '../services/login-token.service';
import { ISocialAuthStrategy } from '../strategies/social-login/interfaces/social-auth-base.strategy';
import { KakaoStrategy } from '../strategies/social-login/kakao/kakao.strategy';
import { UserService } from 'src/api/user/user.service';
import { TokenStorageStrategy } from '../strategies/storages/base/token-storage.strategy';
import { AppleStrategy } from '../strategies/social-login/apple/apple.strategy';
import { SocialUserInfoDto } from '../dto/social-common/social-user-info.dto';

@Injectable()
export class AuthService {
  private readonly SOCIAL_LOGIN_MAP: Record<AuthProvider, ISocialAuthStrategy>;

  constructor(
    private readonly kakaoAuthService: KakaoStrategy,
    private readonly appleAuthService: AppleStrategy,
    private readonly loginTokenService: LoginTokenService,
    private readonly userService: UserService,
    private readonly tokenStorage: TokenStorageStrategy,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
      [AuthProvider.APPLE]: this.appleAuthService,
    };
  }

  /**
   * 로그인 provider에 해당하는 social strategy 반환
   *
   * @author 조희주
   */
  public getSocialAuthStrategy(provider: AuthProvider): ISocialAuthStrategy {
    return this.SOCIAL_LOGIN_MAP[provider];
  }

  public async generateTokenPairWithSocialAuth(
    userInfo: SocialUserInfoDto,
  ): Promise<TokenPair> {
    const user = await this.userService.createUser(userInfo);

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
  public async login(provider: AuthProvider, code: string): Promise<TokenPair> {
    const socialAuthService = this.getSocialAuthStrategy(provider);

    const extractedUserInfo = await socialAuthService.login(code);
    return this.generateTokenPairWithSocialAuth(extractedUserInfo);
  }

  /**
   * Kakao SDK를 사용하여 로그인
   */
  public async sdkLogin(token: string): Promise<TokenPair> {
    const extractedUserInfo = await this.kakaoAuthService.sdkLogin(token);
    return this.generateTokenPairWithSocialAuth(extractedUserInfo);
  }

  public async regenerateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    return this.tokenStorage.regenerateAccessTokenFromRefreshToken(
      refreshToken,
    );
  }
}
