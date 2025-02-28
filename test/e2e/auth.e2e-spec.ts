import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginTokenService } from 'src/auth/services/login-token.service';
import { KakaoStrategy } from 'src/auth/strategies/kakao/kakao.strategy';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { extractCookieValue } from 'test/utils/extract-cookie-value.util';

/**
 * authController e2e test
 *
 * @author 이수인
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let prismaTestingHelper: PrismaTestingHelper<PrismaService> | undefined;

  beforeEach(async () => {
    if (!prismaTestingHelper) {
      prismaTestingHelper = new PrismaTestingHelper(new PrismaService());
      prisma = prismaTestingHelper.getProxyClient();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();

    await prismaTestingHelper.startNewTransaction();

    await app.init();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    prismaTestingHelper?.rollbackCurrentTransaction();
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

      // 최초 로그인 사용자 db에 존재하지 않은지 확인 (사용자 정보가 db에 반드시 등록되도록 보장하기 위함)
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
        .expect(302);

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
      ).resolves.toMatchObject({ idx: user.idx });
      await expect(
        loginTokenService.verifyAccessToken(refreshToken),
      ).resolves.toMatchObject({ idx: user.idx });
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
        .expect(302);

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
      ).resolves.toMatchObject({ idx: user.idx });
      await expect(
        loginTokenService.verifyAccessToken(refreshToken),
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
