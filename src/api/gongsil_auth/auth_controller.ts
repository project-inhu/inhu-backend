import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth_service';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('login-page')
  @Redirect()
  async kakaoLogin(): Promise<{ url: string }> {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code
    &client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}
    &redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URL')}`;

    return { url: kakaoLoginUrl };
  }

  @Public()
  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new UnauthorizedException('인가 코드가 없습니다.');
    }

    const { accessToken, refreshToken } =
      await this.authService.loginWithKakao(code);

    res.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.redirect('http://localhost:3000/auth/test');
  }

  @Get('test')
  async test() {
    return { message: '인증 성공' };
  }

  @Public()
  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(req);

    res.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
}
