import { RedisService } from '@libs/common/modules/redis/redis.service';
import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { extractCookieValueFromSetCookieHeader } from '@libs/testing/utils/extract-cookie-value.util';
import { ConfigService } from '@nestjs/config';
import { AppleLoginStrategy } from '@user/api/auth/social-login/strategy/apple/apple-login.strategy';
import { KakaoLoginStrategy } from '@user/api/auth/social-login/strategy/kakao/kakao-login.strategy';
import { AppModule } from '@user/app.module';
import { TokenCategory } from '@user/common/module/login-token/constants/token-category.constant';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Auth E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);

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
      // mocking kakao redirect url
      const mockingUrl = 'mocking-kakao-url';
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginRedirect')
        .mockReturnValue(mockingUrl);

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
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'getSocialLoginRedirect')
        .mockReturnValue(mockingUrl);

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
        provider: AuthProvider.KAKAO,
      };

      // 첫 로그인 시, 해당 snsId로 유저가 존재하지 않아야 함
      const prisma = testHelper.getPrisma();
      const noUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(noUser).toBeNull();

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/web')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(response.body).toHaveProperty('accessToken');
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.KAKAO);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - successfully issue access token and refresh token (second login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.KAKAO,
      };

      // 두 번째 로그인 시, 해당 snsId로 유저가 존재해야 함
      await userSeedHelper.seed({
        nickname: 'test-nickname',
        social: {
          provider: AuthProvider.KAKAO,
          snsId: mockingOAuthInfo.snsId,
        },
      });
      const prisma = testHelper.getPrisma();
      const existingUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(existingUser).not.toBeNull();

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/web')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(response.body).toHaveProperty('accessToken');
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.KAKAO);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - tokens have correct issuedBy for web)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.KAKAO,
      };

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/web')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(response.body).toHaveProperty('accessToken');
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 사용자 정보 조회
      const prisma = testHelper.getPrisma();
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });

      // refresh token 에 의도된 정보가 포함되어야 함
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload = await loginTokenService.verifyRefreshToken(
        refreshToken ?? '',
      );
      expect(refreshTokenPayload.category).toBe(TokenCategory.REFRESH);
      expect(refreshTokenPayload.issuedBy).toBe(TokenIssuedBy.WEB);
      expect(refreshTokenPayload.idx).toBe(user.idx);

      // access token 에 의도된 정보가 포함되어야 함
      const accessToken = response.body.accessToken;
      const accessTokenPayload =
        await loginTokenService.verifyAccessToken(accessToken);
      expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.WEB);
      expect(accessTokenPayload.idx).toBe(user.idx);
      expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('404 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper
        .test()
        .get(`/auth/${invalidProvider}/callback/web`)
        .expect(404);
    });
  });

  describe('GET /auth/kakao/callback/app', () => {
    it('200 - successfully issue access token and refresh token (first login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.KAKAO,
      };

      // 첫 로그인 시, 해당 snsId로 유저가 존재하지 않아야 함
      const prisma = testHelper.getPrisma();
      const noUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
          },
        },
      });
      expect(noUser).toBeNull();

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/app')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.KAKAO);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - successfully issue access token and refresh token (second login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.KAKAO,
      };

      // 두 번째 로그인 시, 해당 snsId로 유저가 존재해야 함
      await userSeedHelper.seed({
        nickname: 'test-nickname',
        social: {
          provider: AuthProvider.KAKAO,
          snsId: mockingOAuthInfo.snsId,
        },
      });
      const prisma = testHelper.getPrisma();
      const existingUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(existingUser).not.toBeNull();

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/app')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.KAKAO);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - tokens have correct issuedBy for app)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.KAKAO,
      };

      // mocking kakao social login
      const kakaoLoginStrategy = testHelper.get(KakaoLoginStrategy);
      jest
        .spyOn(kakaoLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .get('/auth/kakao/callback/app')
        .query({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 사용자 정보 조회
      const prisma = testHelper.getPrisma();
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.KAKAO,
          },
        },
      });

      // refresh token 에 의도된 정보가 포함되어야 함
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload = await loginTokenService.verifyRefreshToken(
        response.body.refreshToken,
      );
      expect(refreshTokenPayload.category).toBe(TokenCategory.REFRESH);
      expect(refreshTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(refreshTokenPayload.idx).toBe(user.idx);

      // access token 에 의도된 정보가 포함되어야 함
      const accessToken = response.body.accessToken;
      const accessTokenPayload =
        await loginTokenService.verifyAccessToken(accessToken);
      expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(accessTokenPayload.idx).toBe(user.idx);
      expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('500 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper
        .test()
        .get(`/auth/${invalidProvider}/callback/app`)
        .expect(500);
    });
  });

  describe('POST /auth/apple/callback/web', () => {
    it('200 - successfully issue access token and refresh token (first login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // 첫 로그인 시, 해당 snsId로 유저가 존재하지 않아야 함
      const prisma = testHelper.getPrisma();
      const noUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(noUser).toBeNull();

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/web')
        .send({ code: 'mocking-code' })
        .expect(302);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');
      // TODO: 리다이렉트 되는지 확인하는 로직 추가

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.APPLE);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - successfully issue access token and refresh token (second login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // 두 번째 로그인 시, 해당 snsId로 유저가 존재해야 함
      await userSeedHelper.seed({
        nickname: 'test-nickname',
        social: {
          provider: AuthProvider.APPLE,
          snsId: mockingOAuthInfo.snsId,
        },
      });
      const prisma = testHelper.getPrisma();
      const existingUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(existingUser).not.toBeNull();

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/web')
        .send({ code: 'mocking-code' })
        .expect(302);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');
      // TODO: 리다이렉트 되는지 확인하는 로직 추가

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.APPLE);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - tokens have correct issuedBy for web)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/web')
        .send({ code: 'mocking-code' })
        .expect(302);

      // access token과 refresh token이 발급되어야 함
      const [type, refreshToken] = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'refreshToken',
      )?.split(' ') || [null, null];
      expect(refreshToken).not.toBeNull();
      expect(type).toBe('Bearer');

      // 사용자 정보 조회
      const prisma = testHelper.getPrisma();
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });

      // refresh token 에 의도된 정보가 포함되어야 함
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload = await loginTokenService.verifyRefreshToken(
        refreshToken ?? '',
      );
      expect(refreshTokenPayload.category).toBe(TokenCategory.REFRESH);
      expect(refreshTokenPayload.issuedBy).toBe(TokenIssuedBy.WEB);
      expect(refreshTokenPayload.idx).toBe(user.idx);

      // access token 에 의도된 정보가 포함되어야 함
      // const accessToken = response.body.accessToken;
      // const accessTokenPayload =
      //   await loginTokenService.verifyAccessToken(accessToken);
      // expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      // expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.WEB);
      // expect(accessTokenPayload.idx).toBe(user.idx);
      // expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('404 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper
        .test()
        .post(`/auth/${invalidProvider}/callback/web`)
        .expect(404);
    });
  });

  describe('POST /auth/apple/callback/app', () => {
    it('200 - successfully issue access token and refresh token (first login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // 첫 로그인 시, 해당 snsId로 유저가 존재하지 않아야 함
      const prisma = testHelper.getPrisma();
      const noUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(noUser).toBeNull();

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/app')
        .send({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.APPLE);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - successfully issue access token and refresh token (second login)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // 두 번째 로그인 시, 해당 snsId로 유저가 존재해야 함
      await userSeedHelper.seed({
        nickname: 'test-nickname',
        social: {
          provider: AuthProvider.APPLE,
          snsId: mockingOAuthInfo.snsId,
        },
      });
      const prisma = testHelper.getPrisma();
      const existingUser = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(existingUser).not.toBeNull();

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/app')
        .send({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 유저 정보가 생성되어야 함
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });
      expect(user.userProvider?.name).toBe(AuthProvider.APPLE);
      expect(user.userProvider?.snsId).toBe(mockingOAuthInfo.snsId);

      // redis에 refresh token이 저장되어야 함
      const redisService = testHelper.get(RedisService);
      const refreshTokenKeys = await redisService.hkeys(`user:${user.idx}:rt`);
      expect(refreshTokenKeys.length).toBe(1);
    });

    it('200 - tokens have correct issuedBy for app)', async () => {
      // mocking
      const mockingOAuthInfo = {
        snsId: 'test-sns-id',
        provider: AuthProvider.APPLE,
      };

      // mocking apple social login
      const appleLoginStrategy = testHelper.get(AppleLoginStrategy);
      jest
        .spyOn(appleLoginStrategy, 'socialLogin')
        .mockResolvedValue(mockingOAuthInfo);

      // testing
      const response = await testHelper
        .test()
        .post('/auth/apple/callback/app')
        .send({ code: 'mocking-code' })
        .expect(200);

      // access token과 refresh token이 발급되어야 함
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // 사용자 정보 조회
      const prisma = testHelper.getPrisma();
      const user = await prisma.user.findFirstOrThrow({
        include: {
          userProvider: true,
        },
        where: {
          userProvider: {
            snsId: mockingOAuthInfo.snsId,
            name: AuthProvider.APPLE,
          },
        },
      });

      // refresh token 에 의도된 정보가 포함되어야 함
      const loginTokenService = testHelper.get(LoginTokenService);
      const refreshTokenPayload = await loginTokenService.verifyRefreshToken(
        response.body.refreshToken,
      );
      expect(refreshTokenPayload.category).toBe(TokenCategory.REFRESH);
      expect(refreshTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(refreshTokenPayload.idx).toBe(user.idx);

      // access token 에 의도된 정보가 포함되어야 함
      const accessToken = response.body.accessToken;
      const accessTokenPayload =
        await loginTokenService.verifyAccessToken(accessToken);
      expect(accessTokenPayload.category).toBe(TokenCategory.ACCESS);
      expect(accessTokenPayload.issuedBy).toBe(TokenIssuedBy.APP);
      expect(accessTokenPayload.idx).toBe(user.idx);
      expect(accessTokenPayload.id).toBe(refreshTokenPayload.jti);
    });

    it('500 - invalid provider', async () => {
      const invalidProvider = 'invalid provider';
      await testHelper
        .test()
        .post(`/auth/${invalidProvider}/callback/app`)
        .expect(500);
    });
  });

  describe('POST /auth/logout/web', () => {
    it('200 - successfully logout', async () => {
      const user = testHelper.loginUsers.user1;
      const refreshToken = user.web.refreshToken;
      const redis = testHelper.get(RedisService);

      // logout 전 refresh token이 존재해야 함
      const beforeRefreshTokenList = await redis.hkeys(`user:${user.idx}:rt`);
      const beforeWebRefreshTokenKey = beforeRefreshTokenList.find((key) => {
        const [issuedBy, userIdx, ...rest] = key.split('-');
        return (
          issuedBy === TokenIssuedBy.WEB.toString() &&
          userIdx === user.idx.toString()
        );
      });
      expect(beforeWebRefreshTokenKey).toBeDefined();

      // testing
      await testHelper
        .test()
        .post('/auth/logout/web')
        .set('Cookie', [`refreshToken=Bearer ${refreshToken}`])
        .expect(200);

      // logout 후 refresh token이 삭제되어야 함
      const afterRefreshTokenList = await redis.hkeys(`user:${user.idx}:rt`);
      const afterRefreshTokenKey = afterRefreshTokenList.find((key) => {
        const [issuedBy, userIdx, ...rest] = key.split('-');
        return (
          issuedBy === TokenIssuedBy.WEB.toString() &&
          userIdx === user.idx.toString()
        );
      });
      expect(afterRefreshTokenKey).toBeUndefined();
    });

    it('200 - no refresh token provided', async () => {
      await testHelper.test().post('/auth/logout/web').expect(200);
    });
  });

  describe('POST /auth/logout/app', () => {
    it('200 - successfully logout', async () => {
      const user = testHelper.loginUsers.user1;
      const refreshToken = user.app.refreshToken;
      const redis = testHelper.get(RedisService);

      // logout 전 refresh token이 존재해야 함
      const beforeRefreshTokenList = await redis.hkeys(`user:${user.idx}:rt`);
      const beforeAppRefreshTokenKey = beforeRefreshTokenList.find((key) => {
        const [issuedBy, userIdx, ...rest] = key.split('-');
        return (
          issuedBy === TokenIssuedBy.APP.toString() &&
          userIdx === user.idx.toString()
        );
      });
      expect(beforeAppRefreshTokenKey).toBeDefined();

      // testing
      await testHelper
        .test()
        .post('/auth/logout/app')
        .send({ refreshTokenWithType: `Bearer ${refreshToken}` })
        .expect(200);

      // logout 후 refresh token이 삭제되어야 함
      const afterRefreshTokenList = await redis.hkeys(`user:${user.idx}:rt`);
      const afterRefreshTokenKey = afterRefreshTokenList.find((key) => {
        const [issuedBy, userIdx, ...rest] = key.split('-');
        return (
          issuedBy === TokenIssuedBy.APP.toString() &&
          userIdx === user.idx.toString()
        );
      });
      expect(afterRefreshTokenKey).toBeUndefined();
    });

    it('400 - no refresh token provided', async () => {
      await testHelper.test().post('/auth/logout/app').expect(400);
    });
  });
});
