import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  @Get('kakao-login')
  kakaoRedirect(
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const uri =
      'https://kauth.kakao.com/oauth/authorize?' +
      'response_type=code&' +
      `redirect_uri=${process.env.KAKAO_REDIRECT_URI}&` +
      `client_id=${process.env.KAKAO_CLIENT_ID}`;

    res.redirect(uri);
  }

  @Get('kakao/callback')
  async kakaoAuth(@Query('code') code: string) {
    const kakaoToken = await this.authService.getKakaoToken(code);
    const kakaoUserInfo = await this.authService.getKakaoUserInfo(
      kakaoToken.access_token,
    );
    const user = await this.authService.authenticateKakaoUser(kakaoUserInfo);
    const jwtToken = await this.authService.makeJwtToken(user);

    return jwtToken;
  }
}
