import { Controller, Get, Post, Query, Res, Headers } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthProvider } from './enums/auth-provider.enum';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Provider } from './common/decorators/provider.decorator';
import { Exception } from 'src/common/decorator/exception.decorator';
import { ClientType } from 'src/common/decorator/client-type.decorator';
import { Cookie } from 'src/common/decorator/cookie.decorator';
import { LoginTokenService } from './services/login-token.service';
import { getCookieOption } from 'src/config/cookie-option';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly loginTokenService: LoginTokenService,
  ) {}

  /**
   * 소셜 로그인 요청을 처리하는 엔드포인트
   * - 해당 소셜 로그인 페이지로 리다이렉트
   *
   * @author 강정연
   */
  @Get(':provider/login')
  public socialLogin(
    @Provider() provider: AuthProvider | null,
    @Res() res: Response,
  ): void {
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }

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
    @Provider() provider: AuthProvider | null,
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }

    const { accessToken, refreshToken } = await this.authService.login(
      provider,
      code,
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, getCookieOption());

    return {
      accessToken,
    };
  }

  @Get('kakao-sdk')
  public async sdkCallBack(@Query('token') token: string): Promise<TokenPair> {
    const { accessToken, refreshToken } =
      await this.authService.sdkLogin(token);

    return { accessToken, refreshToken };
  }

  /**
   * Access Token을 갱신하는 엔드포인트
   */
  @Post('refresh-token/regenerate')
  @Exception(
    401,
    `
    case 1) 토큰 유효하지 않음 : invalid token
    case 2) 토큰 만료됨 : refresh Token expired
  `,
  )
  public async regenerateRefreshToken(
    @Headers('Authorization') authorization: string | null,
    @ClientType() clientType: string | null,
    @Cookie('refreshToken') refreshToken: string | null,
  ): Promise<{ accessToken: string } | void> {
    const tokenString =
      (clientType === 'WEB' ? refreshToken : authorization) || '';

    const newAccessToken =
      await this.authService.regenerateAccessTokenFromRefreshToken(
        tokenString.replace('Bearer ', ''),
      );

    return { accessToken: newAccessToken };
  }

  /**
   * 로그아웃 API
   *
   * 주의: 반드시 App환경에서도 호출하십시오.
   *
   * TODO: 로그아웃 시, refresh token store에서 refresh token을 삭제하는 로직이 필요합니다.
   *
   * @author jochongs
   */
  @Post('/logout')
  public async logout(
    @Res({
      passthrough: true,
    })
    res: Response,
  ): Promise<void> {
    res.clearCookie('refreshToken', getCookieOption());
  }
}
