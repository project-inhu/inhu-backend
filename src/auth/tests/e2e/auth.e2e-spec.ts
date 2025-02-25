import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/api/user/repository/user.repository';
import { UserService } from 'src/api/user/user.service';
import { AppModule } from 'src/app.module';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { AuthService } from 'src/auth/services/auth.service';
import { KakaoStrategy } from 'src/auth/strategies/kakao/kakao.strategy';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import * as request from 'supertest';

class AppleStrategy {
  public getAuthLoginUrl(): string {
    return '';
  }
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  const providers = Object.values(AuthProvider);

  it('GET /auth/kakao/callback - first login', async () => {
    const kakaoStrategy = app.get(KakaoStrategy);

    // 1. 인가코드를 통해 토큰 세트를 가져오는 메서드 모킹
    const tokenSet = {
      access_token: 'access token',
      refresh_token: 'refresh token',
      expires_in: 123,
      refresh_token_expires_in: 123,
      token_type: 'bearer',
      id_token: '123123',
      scope: '',
    };
    jest.spyOn(kakaoStrategy, 'getToken').mockResolvedValue(tokenSet);

    // 2. 토큰세트로 사용자 정보를 가져오는 메서드 모킹
    const kakaoId = 123123123;
    const userInfo: KakaoUserInfoDto = {
      id: kakaoId,
    };
    jest.spyOn(kakaoStrategy, 'getUserInfo').mockResolvedValue(userInfo);

    const res = await request(app.getHttpServer())
      .get('/auth/kakao/callback')
      .query({ code: 'mockAuthCode' }) // -> 인가 코드가 실제로 존재하지 않는 코드인데 이거 어떻게 해????
      .expect(302);

    // DB에 잘들어가있는지 확인하는 코드
    const prisma = app.get(PrismaService);
    const user = await prisma.user.findFirstOrThrow({
      select: { idx: true },
      where: {
        userProvider: {
          snsId: kakaoId.toString(),
        },
      },
    });
    expect(user).not.toBeNull();

    // RefreshToken 발급했을 때, Refresh Token이 메모리에 잘 있는지 확인하기
    const refreshToken = app.get(AuthService).getRefreshToken(user.idx);
    expect(refreshToken).not.toBeNull();

    const cookies = res.headers['set-cookie'];
    const responseAccessToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('accessToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    const responseRefreshToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('refreshToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    expect(responseAccessToken).toBeDefined();
    expect(responseRefreshToken).toBeDefined();

    // Access이 진짜 액세스토큰인지
    // Refresh이 진짜 리프레쉬토큰
  });

  it('GET /auth/kakao/callback - second login', async () => {
    const kakaoStrategy = app.get(KakaoStrategy);
    const prisma = app.get(PrismaService);
    const userRepository = app.get(UserRepository);

    // 1. 인가코드를 통해 토큰 세트를 가져오는 메서드 모킹
    const tokenSet = {
      access_token: 'access token',
      refresh_token: 'refresh token',
      expires_in: 123,
      refresh_token_expires_in: 123,
      token_type: 'bearer',
      id_token: '123123',
      scope: '',
    };
    jest.spyOn(kakaoStrategy, 'getToken').mockResolvedValue(tokenSet);

    // 2. 토큰세트로 사용자 정보를 가져오는 메서드 모킹
    const kakaoId = 123123123;

    // 3. 이미 존재하는 사용자임
    const userNickname = 'test-nickname';
    await prisma.user.create({
      data: {
        nickname: userNickname,
        userProvider: {
          create: {
            snsId: kakaoId.toString(),
            name: AuthProvider.KAKAO,
          },
        },
      },
    });

    const userInfo: KakaoUserInfoDto = {
      id: kakaoId,
    };
    jest.spyOn(kakaoStrategy, 'getUserInfo').mockResolvedValue(userInfo);

    const insertUserMock = jest.spyOn(userRepository, 'insertUser');

    const res = await request(app.getHttpServer())
      .get('/auth/kakao/callback')
      .query({ code: 'mockAuthCode' }) // -> 인가 코드가 실제로 존재하지 않는 코드인데 이거 어떻게 해????
      .expect(302);

    expect(insertUserMock).not.toHaveBeenCalled();

    // DB에 잘들어가있는지 확인하는 코드
    const user = await prisma.user.findFirstOrThrow({
      select: { idx: true },
      where: {
        userProvider: {
          snsId: kakaoId.toString(),
        },
      },
    });
    expect(user).not.toBeNull();

    // RefreshToken 발급했을 때, Refresh Token이 메모리에 잘 있는지 확인하기
    const refreshToken = app.get(AuthService).getRefreshToken(user.idx);
    expect(refreshToken).not.toBeNull();

    const cookies = res.headers['set-cookie'];
    const responseAccessToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('accessToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    const responseRefreshToken = Array.isArray(cookies)
      ? cookies
          .find((cookie) => cookie.startsWith('refreshToken='))
          ?.split(';')[0]
          ?.split('=')[1]
      : cookies.split(';')[0]?.split('=')[1];

    expect(responseAccessToken).toBeDefined();
    expect(responseRefreshToken).toBeDefined();

    // Access이 진짜 액세스토큰인지
    // Refresh이 진짜 리프레쉬토큰
  });

  it('registerUser - first login', async () => {
    const userService = app.get(UserService);

    const userRepository = app.get(UserRepository);

    jest.spyOn(userRepository, 'selectUserBySnsId').mockResolvedValue(null);

    const insertUserMethod = jest
      .spyOn(userRepository, 'insertUser')
      .mockResolvedValue({
        idx: 1,
        nickname: '테스트닉네임',
        createdAt: new Date(),
        deletedAt: null,
        profileImagePath: null,
      });

    const snsId = '123123';
    const result = await userService.registerUser({
      id: snsId,
      provider: AuthProvider.KAKAO,
    });

    expect(result.idx).toBe(1);
    expect(insertUserMethod).toHaveBeenCalledWith(snsId, AuthProvider.KAKAO);
  });
});
