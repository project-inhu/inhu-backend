import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthProvider } from './enums/auth-provider.enum';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Provider } from './common/decorators/provider.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 소셜 로그인 요청을 처리하는 엔드포인트
   * - 해당 소셜 로그인 페이지로 리다이렉트
   *
   * @author 강정연
   */
  @Get(':provider/login')
  public socialLogin(
    @Provider() provider: AuthProvider,
    @Res() res: Response,
  ): void {
    const socialAuthService = this.authService.getSocialAuthStrategy(provider);
    return res.redirect(socialAuthService.getAuthLoginUrl());
  }

  /**
   * 소셜 로그인 콜백 처리 엔드포인트
   * - JWT 토큰을 발급하고 메인 페이지로 리다이렉트
   *
   * @author 강정연
   */
  @Get(':provider/callback')
  public async callBack(
    @Provider() provider: AuthProvider,
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.login(
      provider,
      code,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    const mainPageUrl = this.configService.get<string>('MAIN_PAGE_URL');
    if (!mainPageUrl) {
      throw new Error('url environment variable is not set');
    }

    return res.redirect(mainPageUrl);
  }
}
