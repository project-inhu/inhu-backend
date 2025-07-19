import {
  AUTH_PROVIDER,
  AuthProvider,
  UserCoreService,
  UserModel,
} from '@libs/core';
import { Injectable } from '@nestjs/common';
import { ISocialLoginStrategy } from '@user/api/auth/social-login/ISocialLogin-strategy.interface';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly socialAuthProviderMap: Record<
    AuthProvider,
    ISocialLoginStrategy
  >;

  constructor(
    private readonly kakaoLoginStrategy: ISocialLoginStrategy,
    private readonly userCoreService: UserCoreService,
  ) {
    this.socialAuthProviderMap = {
      [AUTH_PROVIDER.KAKAO]: this.kakaoLoginStrategy,
      [AUTH_PROVIDER.APPLE]: this.kakaoLoginStrategy, // TODO: apple 로그인 전략 추가 필요
    };
  }

  public async login(req: Request, provider: AuthProvider) {
    const strategy = this.socialAuthProviderMap[provider];

    const oauthInfo = await strategy.socialLogin(provider, req);

    const userModel = await this.upsertUserByOauthInfo(oauthInfo);

    // 해당 사용자가 정지되었는지 판단하거나 등등

    // refresh token 만드는 로직
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
      nickname: 'TODO',
      profileImagePath: null,
      social: {
        provider: oauthInfo.provider,
        snsId: oauthInfo.snsId,
      },
    });
  }
}
