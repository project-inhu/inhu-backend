import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { LoginTokenService } from '../services/login-token.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { createMock } from '@golevelup/ts-jest';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let loginTokenService: LoginTokenService;
  let authService: AuthService;
  let executionContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: LoginTokenService,
          useValue: {
            verifyAccessToken: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            regenerateAccessTokenFromRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    loginTokenService = module.get<LoginTokenService>(LoginTokenService);
    authService = module.get<AuthService>(AuthService);
    executionContext = createMock<ExecutionContext>();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
    expect(loginTokenService).toBeDefined();
    expect(authService).toBeDefined();
    expect(executionContext).toBeDefined();
  });

  it('access token 유효하면 요청 허용', async () => {
    jest.spyOn(executionContext.switchToHttp(), 'getRequest').mockReturnValue({
      cookies: { accessToken: 'valid-access-token' },
    });

    jest
      .spyOn(loginTokenService, 'verifyAccessToken')
      .mockResolvedValue({ idx: 1 });

    expect(await authGuard.canActivate(executionContext)).toBe(true);

    expect(
      executionContext.switchToHttp().getRequest().cookies.accessToken,
    ).not.toBeNull();

    expect(loginTokenService.verifyAccessToken).toHaveBeenCalledWith(
      'valid-access-token',
    );

    expect(executionContext.switchToHttp().getRequest()).toEqual(
      expect.objectContaining({
        user: { idx: 1 },
      }),
    );
  });

  it('access token이 없으면 401 error', async () => {
    jest.spyOn(executionContext.switchToHttp(), 'getRequest').mockReturnValue({
      cookies: {},
    });

    await expect(authGuard.canActivate(executionContext)).rejects.toThrow(
      new UnauthorizedException('Access token not found'),
    );

    expect(loginTokenService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('access token 만료됐으면 refresh token으로 새 access token 재발급', async () => {
    jest.spyOn(executionContext.switchToHttp(), 'getRequest').mockReturnValue({
      cookies: {
        accessToken: 'invalid-access-token',
        refreshToken: 'valid-refresh-token',
      },
    });

    jest.spyOn(loginTokenService, 'verifyAccessToken').mockResolvedValue(null);

    jest
      .spyOn(authService, 'regenerateAccessTokenFromRefreshToken')
      .mockResolvedValue('new-access-token');

    expect(await authGuard.canActivate(executionContext)).toBe(true);

    expect(
      executionContext.switchToHttp().getRequest().cookies.accessToken,
    ).not.toBeNull();

    expect(loginTokenService.verifyAccessToken).toHaveBeenCalledWith(
      'invalid-access-token',
    );
    expect(
      authService.regenerateAccessTokenFromRefreshToken,
    ).toHaveBeenCalledWith('valid-refresh-token');

    expect(
      executionContext.switchToHttp().getResponse().cookie,
    ).toHaveBeenCalledWith(
      'accessToken',
      'new-access-token',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
  });

  it('access token, refresh token 모두 만료됐으면 401 error', async () => {
    jest.spyOn(executionContext.switchToHttp(), 'getRequest').mockReturnValue({
      cookies: {
        accessToken: 'invalid-access-token',
        refreshToken: 'invalid-refresh-token',
      },
    });

    jest.spyOn(loginTokenService, 'verifyAccessToken').mockResolvedValue(null);

    jest
      .spyOn(authService, 'regenerateAccessTokenFromRefreshToken')
      .mockImplementation(async () => {
        throw new UnauthorizedException('Invalid refresh token');
      });

    await expect(authGuard.canActivate(executionContext)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token'),
    );

    expect(
      executionContext.switchToHttp().getRequest().cookies.accessToken,
    ).not.toBeNull();

    expect(loginTokenService.verifyAccessToken).toHaveBeenCalledWith(
      'invalid-access-token',
    );
    expect(
      authService.regenerateAccessTokenFromRefreshToken,
    ).toHaveBeenCalledWith('invalid-refresh-token');
  });
});
