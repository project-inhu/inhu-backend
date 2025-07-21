import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { AUTH_PROVIDER } from '@libs/core';
import { AuthService } from '@user/api/auth/auth.service';
import { KakaoLoginStrategy } from '@user/api/auth/social-login/strategy/kakao/kakao-login.strategy';
import { AppModule } from '@user/app.module';
import { TokenCategory } from '@user/common/module/login-token/constants/token-category.constant';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { extractCookieValue } from 'apps/user-server/test/util/extract-cookie-value.util';

describe('Auth E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /auth/refresh-token/regenerate/web', () => {
    it('200 - successfully reissues access token', async () => {
      const { user1 } = testHelper.loginUsers;

      const response = await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${user1.app.refreshToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).toBeDefined();
    });

    it('401 - no refresh token', async () => {
      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .expect(401);
    });

    it('401 - using invalidated refresh token', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const refreshToken = loginUser.app.refreshToken;

      // invalidate the refresh token
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload =
        await loginTokenService.verifyRefreshToken(refreshToken);
      await loginTokenService.invalidateRefreshTokenById(
        refreshTokenPayload.idx,
        refreshTokenPayload.jti,
        TokenIssuedBy.APP,
      );

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${refreshToken}`])
        .expect(401);
    });

    it('401 - invalid refresh token', async () => {
      const invalidRefresh = 'invalid refresh token';

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/web')
        .set('Cookie', [`refreshToken=Bearer ${invalidRefresh}`])
        .expect(401);
    });
  });

  describe('POST /auth/refresh-token/regenerate/app', () => {
    it('200 - successfully reissues access token', async () => {
      const { user1 } = testHelper.loginUsers;
      const refreshToken = user1.app.refreshToken;

      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload =
        await loginTokenService.verifyRefreshToken(refreshToken);

      const response = await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${refreshToken}` })
        .expect(200);

      const accessToken = response.body.accessToken;

      expect(accessToken).toBeDefined();

      const accessTokenPayload =
        await loginTokenService.verifyAccessToken(accessToken);

      expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(accessTokenPayload.idx).toBe(refreshTokenPayload.idx);
      expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('400 - no refresh token provided', async () => {
      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .expect(400);
    });

    it('401 - invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid refresh token';

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${invalidRefreshToken}` })
        .expect(401);
    });

    it('401 - using invalidated refresh token', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const refreshToken = loginUser.app.refreshToken;

      // invalidate the refresh token
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload =
        await loginTokenService.verifyRefreshToken(refreshToken);
      await loginTokenService.invalidateRefreshTokenById(
        refreshTokenPayload.idx,
        refreshTokenPayload.jti,
        TokenIssuedBy.APP,
      );

      await testHelper
        .test()
        .post('/auth/refresh-token/regenerate/app')
        .send({ refreshTokenWithType: `Bearer ${refreshToken}` })
        .expect(401);
    });
  });

  describe('GET /auth/kakao/login', () => {
    it('302 - successfully redirects to kakao', async () => {
      const mockingUrl = 'mocking-kakao-url';
      const authService = testHelper.get(AuthService);
      jest
        .spyOn(authService, 'getSocialLoginRedirect')
        .mockResolvedValue(mockingUrl);

      const response = await testHelper
        .test()
        .get('/auth/kakao/login')
        .expect(302);

      expect(response.headers.location).toContain(mockingUrl);
    });

    it('500 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper.test().get(`/auth/${invalidProvider}/login`).expect(500);
    });
  });

  describe('GET /auth/apple/login', () => {
    it('302 - successfully redirects to apple', async () => {
      const mockingUrl = 'mocking-apple-url';
      const authService = testHelper.get(AuthService);
      jest
        .spyOn(authService, 'getSocialLoginRedirect')
        .mockResolvedValue(mockingUrl);

      const response = await testHelper
        .test()
        .get('/auth/apple/login')
        .expect(302);

      expect(response.headers.location).toContain(mockingUrl);
    });

    it('500 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper.test().get(`/auth/${invalidProvider}/login`).expect(500);
    });
  });

  describe('GET /auth/kakao/callback/web', () => {
    it('200 - successfully issue access token and refresh token (first login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AUTH_PROVIDER.KAKAO,
      };

      // 첫 로그인 시, 해당 snsId로 유저가 존재하지 않아야 함
      const prisma = testHelper.get(PrismaService);
      let user = await prisma.user.findFirst({
        select: {
          idx: true,
          nickname: true,
          userProvider: {
            select: {
              snsId: true,
              name: true,
            },
          },
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
          },
        },
      });
      expect(user).toBeNull();

      // mocking kakao social login
      const kakaoService = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoService, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/web')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValue(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(response.body).toHaveProperty('accessToken');
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 유저 정보가 생성되어야 함
      user = await prisma.user.findFirstOrThrow({
        select: {
          idx: true,
          nickname: true,
          userProvider: {
            select: {
              snsId: true,
              name: true,
            },
          },
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
          },
        },
      });
      expect(user?.userProvider?.name).toBe(AUTH_PROVIDER.KAKAO);
      expect(user?.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - successfully issue access token and refresh token (second login)', async () => {
      // mocking
      const mockingUserInfo = {
        nickname: 'test-nickname',
        userProvider: {
          snsId: 'test-sns-id',
          provider: AUTH_PROVIDER.KAKAO,
        },
      };

      // 두 번째 로그인 시, 해당 snsId로 유저가 존재해야 함
      const prisma = testHelper.get(PrismaService);
      await prisma.user.create({
        data: {
          nickname: mockingUserInfo.nickname,
          userProvider: {
            create: {
              snsId: mockingUserInfo.userProvider.snsId,
              name: mockingUserInfo.userProvider.provider,
            },
          },
        },
      });
      let user = await prisma.user.findFirst({
        select: {
          idx: true,
          nickname: true,
          userProvider: {
            select: {
              snsId: true,
              name: true,
            },
          },
        },
        where: {
          userProvider: {
            snsId: mockingUserInfo.userProvider.snsId,
          },
        },
      });
      expect(user).not.toBeNull();

      // mocking kakao social login
      const kakaoService = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoService, 'socialLogin')
        .mockResolvedValue(mockingUserInfo.userProvider);

      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/web')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValue(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(response.body).toHaveProperty('accessToken');
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 유저 정보가 생성되어야 함
      user = await prisma.user.findFirstOrThrow({
        select: {
          idx: true,
          nickname: true,
          userProvider: {
            select: {
              snsId: true,
              name: true,
            },
          },
        },
        where: {
          userProvider: {
            snsId: mockingUserInfo.userProvider.snsId,
          },
        },
      });
      expect(user?.userProvider?.name).toBe(AUTH_PROVIDER.KAKAO);
      expect(user?.userProvider?.snsId).toBe(
        mockingUserInfo.userProvider.snsId,
      );

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });
  });
});
