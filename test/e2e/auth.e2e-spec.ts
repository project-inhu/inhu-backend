import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { LoginTokenService } from 'src/auth/services/login-token.service';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { extractCookieValue } from 'test/common/utils/extract-cookie-value.util';
import { TestManager } from 'test/common/helpers/test-manager';
import { KakaoStrategy } from 'src/auth/strategies/social-login/kakao/kakao.strategy';
import { SocialTokenService } from 'src/auth/strategies/social-login/services/social-token.service';
import { TokenStorageStrategy } from 'src/auth/strategies/storages/base/token-storage.strategy';

/**
 * authController e2e test
 *
 * @author 이수인
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let test = TestManager.create();

  beforeAll(async () => {
    await test.init();
    app = test.getApp();
  });

  beforeEach(async () => {
    await test.startTransaction();
  });

  afterAll(async () => {
    await test.close();
  });

  afterEach(() => {
    test.rollbackTransaction();
  });

  describe('GET /auth/kakao/login', () => {
    it('redirects to Kakao login url', async () => {
      const kakaoStrategy = app.get(KakaoStrategy);
      const mockingLoginUrl = '/mocking/login/url';

      jest
        .spyOn(kakaoStrategy, 'getAuthLoginUrl')
        .mockReturnValue(mockingLoginUrl);

      const res = await request(app.getHttpServer())
        .get('/auth/kakao/login')
        .expect(302);

      expect(res.headers.location).toContain(mockingLoginUrl);
    });

    it('returns 400 for invalid provider', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/invalidProvider/login')
        .expect(302);

      expect(res.headers.location).toContain(
        app.get(ConfigService).get<string>('MAIN_PAGE_URL') || '/',
      );
    });
  });

  describe('GET /auth/kakao/callback', () => {
    it('first login', async () => {
      // login mocking
      const kakaoStrategy = app.get(KakaoStrategy);
      const kakaoId = 1111111111;
      jest
        .spyOn(kakaoStrategy, 'login')
        .mockImplementation(async (code: string) => {
          return { snsId: kakaoId.toString(), provider: AuthProvider.KAKAO };
        });

      // 최초 로그인 사용자 db에 존재하지 않은지 확인 (사용자 정보가 db에 반드시 등록되도록 보장하기 위함)
      const prisma = app.get(PrismaService);
      let user = await prisma.user.findFirst({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).toBeNull();

      const res = await request(app.getHttpServer())
        .get('/auth/kakao/callback')
        .query({ code: 'mockingCode' })
        .expect(200);

      // 최초 로그인 사용자 정보 정상 등록 확인
      user = await prisma.user.findFirstOrThrow({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).not.toBeNull();

      // memory에 refresh 정상 등록 확인
      expect(
        app.get(TokenStorageStrategy).getRefreshToken(user?.idx),
      ).not.toBeNull();

      // refresh-token 쿠키에 정상 등록 확인
      const cookies = res.headers['set-cookie'];
      const refreshToken = extractCookieValue(cookies, 'refreshToken');
      expect(refreshToken).toBeTruthy();

      // refresh-token 이 의도한 값인지 확인
      const loginTokenService = app.get(LoginTokenService);
      await expect(
        loginTokenService.verifyRefreshToken(
          refreshToken.replace('Bearer%20', ''),
        ),
      ).resolves.toMatchObject({ idx: user.idx });
    });

    it('second login', async () => {
      // login mocking
      const kakaoStrategy = app.get(KakaoStrategy);
      const kakaoId = 1111111111;
      jest
        .spyOn(kakaoStrategy, 'login')
        .mockImplementation(async (code: string) => {
          return { snsId: kakaoId.toString(), provider: AuthProvider.KAKAO };
        });

      // 기존 사용자임을 가정하기 위해 임의 값 등록
      const prisma = app.get(PrismaService);
      await prisma.user.create({
        data: {
          nickname: 'mock-nickname',
          userProvider: {
            create: {
              snsId: kakaoId.toString(),
              name: AuthProvider.KAKAO,
            },
          },
        },
      });

      // 기존 사용자 이미 db에 존재하는지 확인 (사용자 정보가 db에 등록되지 않도록 보장하기 위함)
      // 최초 로그인 사용자 아니기 때문에 등록 x
      let user = await prisma.user.findFirstOrThrow({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).not.toBeNull();

      const res = await request(app.getHttpServer())
        .get('/auth/kakao/callback')
        .query({ code: 'mockingCode' })
        .expect(200);

      // 기존 사용자 정보 정상 select 확인
      user = await prisma.user.findFirstOrThrow({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).not.toBeNull();

      // memory에 refresh 정상 등록 확인
      expect(
        app.get(TokenStorageStrategy).getRefreshToken(user?.idx),
      ).not.toBeNull();

      // refresh-token 쿠키에 정상 등록 확인
      const cookies = res.headers['set-cookie'];
      const refreshToken = extractCookieValue(cookies, 'refreshToken');
      expect(refreshToken).toBeTruthy();

      // refresh-token 이 의도한 값인지 확인
      const loginTokenService = app.get(LoginTokenService);
      await expect(
        loginTokenService.verifyRefreshToken(
          refreshToken.replace('Bearer%20', ''),
        ),
      ).resolves.toMatchObject({ idx: user.idx });
    });

    it('returns 400 for invalid provider', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/invalidProvider/callback')
        .expect(302);

      expect(res.headers.location).toContain(
        app.get(ConfigService).get<string>('MAIN_PAGE_URL') || '/',
      );
    });
  });
});
