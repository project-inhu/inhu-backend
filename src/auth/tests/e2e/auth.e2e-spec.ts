import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/api/user/user.service';
import { AppModule } from 'src/app.module';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { AuthService } from 'src/auth/services/auth.service';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
  });

  const providers = Object.values(AuthProvider);

  it.each(providers)(`/GET /auth/kakao/login`, () => {
    return request(app.getHttpServer()).get('/auth/kakao/login').expect(302);
  });

  it.each(providers)(`/GET /auth/kakao/callback`, async () => {
    jest.spyOn(authService, 'login').mockImplementation(async () => {
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
    });

    const res = await request(app.getHttpServer())
      .get('/auth/kakao/callback')
      .query({ code: 'mockAuthCode' })
      .expect(302);

    const cookies = res.headers['set-cookie'];
    const accessToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('accessToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    const refreshToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('refreshToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(accessToken).toBe('mock-access-token');
    expect(refreshToken).toBe('mock-refresh-token');
  });

  afterAll(async () => {
    await app.close();
  });
});
