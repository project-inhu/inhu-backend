import { Cookie, Exception } from '@libs/common';
import { AuthProvider } from '@libs/core';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@user/api/auth/auth.service';
import cookieConfig from '@user/api/auth/config/cookie.config';
import { LogoutAppDto } from '@user/api/auth/dto/request/logout-app.dto';
import { ReissueAccessTokenAppDto } from '@user/api/auth/dto/request/reissue-access-token-app.dto';
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
   * access token을 재발급하는 엔드포인트
   */
  @Post('/refresh-token/regenerate/app')
  @HttpCode(200)
  @Exception(401, 'Invalid refresh token')
  public async reissueAccessTokenApp(@Body() dto: ReissueAccessTokenAppDto) {
    const refreshToken = dto.refreshTokenWithType.replace('Bearer ', '');
    return await this.authService.reissueAccessToken(refreshToken);
  }

  /**
   * access token을 재발급하는 엔드포인트
   */
  @Post('/refresh-token/regenerate/web')
  @HttpCode(200)
  @Exception(401, 'Invalid refresh token')
  public async reissueAccessToken(
    @Cookie('refreshToken') refreshTokenWithType?: string,
  ) {
    const refreshToken = refreshTokenWithType?.replace('Bearer ', '');
    return await this.authService.reissueAccessToken(refreshToken);
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

  /**
   * 앱용 로그아웃 API
   */
  @Post('/logout/app')
  public async logout(@Body() dto: LogoutAppDto): Promise<void> {
    const refreshToken = dto.refreshTokenWithType?.replace('Bearer ', '');

    await this.authService.logout(refreshToken);
  }

  /**
   * 웹용 로그아웃 API
   */
  @Post('/logout/web')
  public async logoutWeb(
    @Res({ passthrough: true }) res: Response,
    @Cookie('refreshToken') refreshTokenWithType?: string,
  ): Promise<void> {
    const refreshToken = refreshTokenWithType?.replace('Bearer ', '');

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken', cookieConfig());
  }
}
