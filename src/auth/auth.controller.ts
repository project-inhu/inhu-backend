import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthProvider } from './enums/auth-provider.enum';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Provider } from './common/decorators/provider.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Exception } from 'src/common/decorator/exception.decorator';

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
    @Provider() provider: AuthProvider | null,
    @Res() res: Response,
  ): void {
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }
    // console.log(provider);

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
    @Res() res: Response,
  ): Promise<void> {
    if (!provider) {
      return res.redirect(
        this.configService.get<string>('MAIN_PAGE_URL') || '/',
      );
    }

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

    const mainPageUrl = this.configService.get<string>('MAIN_PAGE_URL') || '/';

    return res.redirect(mainPageUrl);
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
    case 1) 토큰 없음 : refresh token not found
    case 2) 토큰 유효하지 않음 : invalid token
    case 3) 토큰 만료됨 : refresh Token expired
  `,
  )
  public async regenerateRefreshToken(
    @Req() req: Request,
    @Headers('Authorization') authorization: string | null,
  ): Promise<{ accessToken: string } | void> {
    const clientType = req.headers?.['X-Client-Type'];
    let refreshToken: string | null = null;

    if (clientType === 'WEB') {
      refreshToken = req.cookies?.refreshToken ?? null;
    } else if (clientType === 'WEBVIEW') {
      refreshToken = authorization?.replace('Bearer ', '') ?? null;
    }

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token not found');
    }

    const { newAccessToken } =
      await this.authService.regenerateAccessTokenFromRefreshToken(
        refreshToken,
      );

    return { accessToken: newAccessToken };
  }
}
