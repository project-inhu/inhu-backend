import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { UserModel } from '@libs/core/user/model/user.model';
import { UserCoreService } from '@libs/core/user/user-core.service';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ISocialLoginStrategy } from '@user/api/auth/social-login/ISocialLogin-strategy.interface';
import { AppleLoginStrategy } from '@user/api/auth/social-login/strategy/apple/apple-login.strategy';
import { KakaoLoginStrategy } from '@user/api/auth/social-login/strategy/kakao/kakao-login.strategy';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly socialAuthProviderMap: Record<
    AuthProvider,
    ISocialLoginStrategy
  >;

  constructor(
    private readonly kakaoLoginStrategy: KakaoLoginStrategy,
    private readonly appleLoginStrategy: AppleLoginStrategy,
    private readonly userCoreService: UserCoreService,
    private readonly loginTokenService: LoginTokenService,
  ) {
    this.socialAuthProviderMap = {
      [AuthProvider.KAKAO]: this.kakaoLoginStrategy,
      [AuthProvider.APPLE]: this.appleLoginStrategy,
    };
  }

  public async getSocialLoginRedirect(provider: AuthProvider) {
    const strategy = this.socialAuthProviderMap[provider];

    if (!strategy) {
      throw new InternalServerErrorException();
    }

    return strategy.getSocialLoginRedirect();
  }

  public async login(
    req: Request,
    provider: AuthProvider,
    issuedBy: TokenIssuedBy,
  ) {
    const strategy = this.socialAuthProviderMap[provider];
    if (!strategy) {
      throw new InternalServerErrorException();
    }

    const oauthInfo = await strategy.socialLogin(provider, req);

    const userModel = await this.upsertUserByOauthInfo(oauthInfo);

    // 해당 사용자가 정지되었는지 판단하거나 등등

    // refresh token 만드는 로직
    return await this.loginTokenService.issueTokenSet(
      { idx: userModel.idx },
      issuedBy,
    );
  }

  private async upsertUserByOauthInfo(
    oauthInfo: OAuthInfo,
  ): Promise<UserModel> {
    const user = await this.userCoreService.getUserBySocialId(
      oauthInfo.snsId,
      oauthInfo.provider,
    );

    if (user) {
      return user;
    }

    return await this.userCoreService.createUser({
      nickname: '새로운 인후러',
      profileImagePath: null,
      social: {
        provider: oauthInfo.provider,
        snsId: oauthInfo.snsId,
      },
    });
  }

  public async reissueAccessToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('There is no refresh token');
    }

    const { accessToken } =
      await this.loginTokenService.reissueAccessToken(refreshToken);

    return { accessToken };
  }

  public async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    try {
      const { idx, issuedBy, jti } =
        await this.loginTokenService.verifyRefreshToken(refreshToken);

      await this.loginTokenService.invalidateRefreshTokenById(
        idx,
        jti,
        issuedBy,
      );
    } catch (err) {
      return;
    }
  }
}
