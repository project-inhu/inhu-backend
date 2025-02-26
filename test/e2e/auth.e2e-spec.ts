import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/api/user/repository/user.repository';
import { AppModule } from 'src/app.module';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginTokenService } from 'src/auth/services/login-token.service';
import { KakaoStrategy } from 'src/auth/strategies/kakao/kakao.strategy';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';

/**
 * authController e2e test
 *
 * @author 이수인
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
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
      // getToken mocking
      const kakaoStrategy = app.get(KakaoStrategy);
      const kakaoToken: KakaoTokenDto = {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        refresh_token: 'mock-refresh-token',
        expires_in: 111111,
        scope: '',
        refresh_token_expires_in: 111111,
        id_token: '11111',
      };
      jest.spyOn(kakaoStrategy, 'getToken').mockResolvedValue(kakaoToken);

      // getUserInfo mocking
      const kakaoId = 1111111111;
      const kakaoUserInfo: KakaoUserInfoDto = {
        id: kakaoId,
      };
      jest.spyOn(kakaoStrategy, 'getUserInfo').mockResolvedValue(kakaoUserInfo);

      // insertUser mocking(추적)
      const userRepository = app.get(UserRepository);
      jest.spyOn(userRepository, 'insertUser');

      const res = await request(app.getHttpServer())
        .get('/auth/kakao/callback')
        .query({ code: 'mockingCode' })
        .expect(302);

      // 최초 로그인 사용자 정보 정상 등록 확인
      const prisma = app.get(PrismaService);
      const user = await prisma.user.findFirstOrThrow({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).not.toBeNull();
      expect(userRepository.insertUser).toHaveBeenCalledTimes(1);

      // memory에 refresh 정상 등록 확인
      expect(app.get(AuthService).getRefreshToken(user?.idx)).not.toBeNull();

      // access-token, refresh-token 쿠키에 정상 등록 확인
      const cookies = res.headers['set-cookie'];
      const accessToken = extractCookieValue(cookies, 'accessToken');
      const refreshToken = extractCookieValue(cookies, 'refreshToken');
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();

      // access-token, refresh-token 이 의도한 값인지 확인
      const loginTokenService = app.get(LoginTokenService);
      await expect(
        loginTokenService.verifyAccessToken(accessToken),
      ).resolves.toMatchObject({ idx: expect.any(Number) });
      await expect(
        loginTokenService.verifyAccessToken(refreshToken),
      ).resolves.toMatchObject({ idx: expect.any(Number) });
    });

    it('second login', async () => {
      // getToken mocking
      const kakaoStrategy = app.get(KakaoStrategy);
      const kakaoToken: KakaoTokenDto = {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        refresh_token: 'mock-refresh-token',
        expires_in: 111111,
        scope: '',
        refresh_token_expires_in: 111111,
        id_token: '11111',
      };
      jest.spyOn(kakaoStrategy, 'getToken').mockResolvedValue(kakaoToken);

      // getUserInfo mocking
      const kakaoId = 1111111111;
      const kakaoUserInfo: KakaoUserInfoDto = {
        id: kakaoId,
      };
      jest.spyOn(kakaoStrategy, 'getUserInfo').mockResolvedValue(kakaoUserInfo);

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

      // insertUser mocking(추적)
      const userRepository = app.get(UserRepository);
      jest.spyOn(userRepository, 'insertUser');

      const res = await request(app.getHttpServer())
        .get('/auth/kakao/callback')
        .query({ code: 'mockingCode' })
        .expect(302);

      // 기존 사용자 정보 정상 select 확인
      // 최초 로그인 사용자 아니기 때문에 등록 x
      const user = await prisma.user.findFirstOrThrow({
        where: {
          userProvider: {
            snsId: kakaoId.toString(),
          },
        },
      });
      expect(user).not.toBeNull();
      expect(userRepository.insertUser).toHaveBeenCalledTimes(0);

      // memory에 refresh 정상 등록 확인
      expect(app.get(AuthService).getRefreshToken(user?.idx)).not.toBeNull();

      // access-token, refresh-token 쿠키에 정상 등록 확인
      const cookies = res.headers['set-cookie'];
      const accessToken = extractCookieValue(cookies, 'accessToken');
      const refreshToken = extractCookieValue(cookies, 'refreshToken');
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();

      // access-token, refresh-token 이 의도한 값인지 확인
      const loginTokenService = app.get(LoginTokenService);
      await expect(
        loginTokenService.verifyAccessToken(accessToken),
      ).resolves.toMatchObject({ idx: expect.any(Number) });
      await expect(
        loginTokenService.verifyAccessToken(refreshToken),
      ).resolves.toMatchObject({ idx: expect.any(Number) });
    });

    it('returns 400 for invalid provider', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/invalidProvider/callback')
        .expect(302);

      expect(res.headers.location).toContain(
        app.get(ConfigService).get<string>('MAIN_PAGE_URL') || '/',
      );
    });

    function extractCookieValue(cookies: string, key: string): string {
      if (Array.isArray(cookies)) {
        return cookies
          .find((cookie) => cookie.startsWith(`${key}=`))
          ?.split(';')[0]
          ?.split('=')[1];
      }
      return '';
    }
  });
});
