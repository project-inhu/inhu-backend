import { Cookie } from '@libs/common/decorator/cookie.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
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

  @Get('test-error-log')
  testErrorLog() {
    console.log('Testing a non-crashing error log...');

    console.error(
      '서버 중단 없는 에러 로그 테스트입니다. 이 메시지가 디스코드에 보여야 합니다.',
    );

    return {
      status: 'OK',
      message:
        'Error log has been sent, but the server is still running perfectly!',
    };
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
   *
   * - request.cookies.refreshToken을 통해 쿠키에 접근합니다.
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
  public async socialLoginViaGet(
    @Req() req: Request,
    @Param('provider') provider: AuthProvider,
  ): Promise<SocialLoginAppResponseDto> {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        req,
        provider,
        TokenIssuedBy.APP,
      );

      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('소셜 로그인 실패');
    }
  }

  /**
   * Web 전용 Social Login Callback을 처리하는 엔드포인트
   */
  @Get('/kakao/callback/web')
  public async socialLoginWebViaGet(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<SocialLoginWebResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      req,
      AuthProvider.KAKAO,
      TokenIssuedBy.WEB,
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, cookieConfig());

    return { accessToken };
  }

  /**
   * App 전용 Social Login Callback을 처리하는 엔드포인트
   */
  @Post('/:provider/callback/app')
  @HttpCode(200)
  public async socialLoginViaPost(
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
  @Post('/apple/callback/web')
  @HttpCode(200)
  public async socialLoginWebViaPost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.login(
      req,
      AuthProvider.APPLE,
      TokenIssuedBy.WEB,
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, cookieConfig());

    res.redirect(this.MAIN_PAGE_URL);
  }

  /**
   * 앱용 로그아웃 API
   */
  @Post('/logout/app')
  @HttpCode(200)
  public async logout(@Body() dto: LogoutAppDto): Promise<void> {
    const refreshToken = dto.refreshTokenWithType?.replace('Bearer ', '');

    await this.authService.logout(refreshToken);
  }

  /**
   * 웹용 로그아웃 API
   */
  @Post('/logout/web')
  @HttpCode(200)
  public async logoutWeb(
    @Res({ passthrough: true }) res: Response,
    @Cookie('refreshToken') refreshTokenWithType?: string,
  ): Promise<void> {
    const refreshToken = refreshTokenWithType?.replace('Bearer ', '');

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken', cookieConfig());
  }
}
