import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Headers,
  Req,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Provider } from './common/decorators/provider.decorator';
import { Exception } from 'src/common/decorator/exception.decorator';
import { ClientType } from 'src/common/decorator/client-type.decorator';
import { Cookie } from 'src/common/decorator/cookie.decorator';
import { getCookieOption } from 'src/config/cookie-option';
import { AuthProviderValue } from './common/constants/auth-provider.constant';

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
   * @author 이수인
   */
  @Get(':provider/login')
  public socialLogin(
    @Provider() provider: AuthProviderValue | null,
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
   *
   * @author 이수인
   */
  @Get(':provider/callback')
  public async handleGetCallBack(
    @Provider() provider: AuthProviderValue | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // ! POST /auth/:provider/callback 과 동일하므로 변경 시 동시에 변경 필요
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }

    const socialAuthService = this.authService.getSocialAuthStrategy(provider);

    const { accessToken, refreshToken } = await this.authService.login(
      provider,
      socialAuthService.extractDtoFromRequest(req),
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, getCookieOption());

    return {
      accessToken,
    };
  }

  /**
   * kakao sdk 를 요청하는 엔드포인트
   *
   * @author 이수인
   */
  @Get('kakao-sdk')
  public async sdkCallBack(@Query('token') token: string): Promise<TokenPair> {
    const { accessToken, refreshToken } =
      await this.authService.sdkLogin(token);

    return { accessToken, refreshToken };
  }

  /**
   * 소셜 로그인 콜백 처리 엔드포인트
   *
   * @author 이수인
   */
  @Post(':provider/callback')
  public async handlePostCallBack(
    @Provider() provider: AuthProviderValue | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // ! GET /auth/:provider/callback 과 동일하므로 변경 시 동시에 변경 필요
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }

    console.log('1. provider in auth.controller.ts:', provider);
    const socialAuthService = this.authService.getSocialAuthStrategy(provider);
    console.log(
      '2. extractDtoFromRequest in auth.controller.ts:',
      socialAuthService.extractDtoFromRequest(req),
    );

    const { accessToken, refreshToken } = await this.authService.login(
      provider,
      socialAuthService.extractDtoFromRequest(req),
    );

    res.cookie('refreshToken', `Bearer ${refreshToken}`, getCookieOption());

    return {
      accessToken,
    };
  }

  /**
   * Access Token을 갱신하는 엔드포인트
   *
   * @author 이수인
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

  @Get('/test')
  public test(): string {
    console.log('test endpoint called');
    return 'test';
  }
}
