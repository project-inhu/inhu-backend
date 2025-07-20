import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { AUTH_PROVIDER } from '@libs/core';
import { ITestHelper } from '@libs/testing';
import { INestApplication, Type } from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';

export type LoginUserForTest = {
  idx: number;
  web: {
    accessToken: string;
    refreshToken: string;
  };
  app: {
    accessToken: string;
    refreshToken: string;
  };
};

export class LoginUserHelper {
  public static async create(testHelper: ITestHelper): Promise<{
    user1: LoginUserForTest;
    user2: LoginUserForTest;
  }> {
    const [user1, user2] = await Promise.all([
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'user-1-nick',
          profileImagePath: null,
          userProvider: {
            create: {
              name: AUTH_PROVIDER.KAKAO,
              snsId: 'user-1-sns-id-000123',
            },
          },
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'user-2-nick',
          profileImagePath: null,
          userProvider: {
            create: {
              name: AUTH_PROVIDER.KAKAO,
              snsId: 'user-2-sns-id-000123',
            },
          },
        },
      }),
    ]);

    const [
      user1AppTokenSet,
      user1WebTokenSet,
      user2AppTokenSet,
      user2WebTokenSet,
    ] = await Promise.all([
      await testHelper
        .get(LoginTokenService)
        .issueTokenSet(user1, TokenIssuedBy.APP),
      await testHelper
        .get(LoginTokenService)
        .issueTokenSet(user1, TokenIssuedBy.WEB),
      await testHelper
        .get(LoginTokenService)
        .issueTokenSet(user2, TokenIssuedBy.APP),
      await testHelper
        .get(LoginTokenService)
        .issueTokenSet(user2, TokenIssuedBy.WEB),
    ]);

    return {
      user1: {
        idx: user1.idx,
        web: {
          accessToken: user1WebTokenSet.accessToken,
          refreshToken: user1WebTokenSet.refreshToken,
        },
        app: {
          accessToken: user1AppTokenSet.accessToken,
          refreshToken: user1AppTokenSet.refreshToken,
        },
      },
      user2: {
        idx: user2.idx,
        web: {
          accessToken: user2WebTokenSet.accessToken,
          refreshToken: user2WebTokenSet.refreshToken,
        },
        app: {
          accessToken: user2AppTokenSet.accessToken,
          refreshToken: user2AppTokenSet.refreshToken,
        },
      },
    };
  }
}
