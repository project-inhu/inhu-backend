import { AuthProvider } from '@libs/core';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@user/api/auth/auth.service';
import cookieConfig from '@user/api/auth/config/cookie.config';
import { SocialLoginAppResponseDto } from '@user/api/auth/dto/response/social-login-app-response.dto';
import { SocialLoginWebResponseDto } from '@user/api/auth/dto/response/social-login-web-response.dto';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
  private readonly MAIN_PAGE_URL: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.MAIN_PAGE_URL = this.configService.get<string>('MAIN_PAGE_URL') || '/';
  }

  /**
   * Social Login Redirect를 처리하는 엔드포인트
   */
  @Get('/:provider/login')
  public async getSocialLoginRedirect(
    @Res() res: Response,
    @Param('provider') provider: AuthProvider,
  ) {
    const url = await this.authService.getSocialLoginRedirect(provider);

    res.redirect(url);
  }

  /**
   * App 전용 Social Login Callback을 처리하는 엔드포인트
   */
  @Get('/:provider/callback/app')
  public async socialLogin(
    @Req() req: Request,
    @Param('provider') provider: AuthProvider,
  ): Promise<SocialLoginAppResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      req,
      provider,
      TokenIssuedBy.APP,
    );

    return { accessToken, refreshToken };
  }

  /**
   * Web 전용 Social Login Callback을 처리하는 엔드포인트
   */
  @Get('/:provider/callback/web')
  public async socialLoginWeb(
    @Res() res: Response,
    @Req() req: Request,
    @Param('provider') provider: AuthProvider,
  ): Promise<SocialLoginWebResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      req,
      provider,
      TokenIssuedBy.WEB,
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, cookieConfig());

    return { accessToken };
  }
}
