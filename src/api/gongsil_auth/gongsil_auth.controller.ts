import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { GongsilAuthService } from './gongsil_auth.service';

@Controller('auth')
export class GongsilAuthController {
  constructor(private gongsilAuthService: GongsilAuthService) {}

  // 로그인 페이지로 이동 (인가 코드 받기 위함...)
  @Get('login-page')
  @Redirect()
  async kakaoLogin() {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code
    &client_id=${'f355f7b93ff5945f5349d6d2f7f49b49'}
    &redirect_uri=${'http://localhost:3000/auth/kakao/callback'}`;

    return { url: kakaoLoginUrl };
  }

  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string) {}

  @Get('getToken')
  async kakaoGetToken(@Body('code') code: string) {
    const kakaoToken = await this.gongsilAuthService.getKakaoAccessToken(code);

    return { access_token: kakaoToken };
  }

  @Get('extractUser')
  async extractUser(@Body('access_token') accessToken: string) {
    const kakaoUserId =
      await this.gongsilAuthService.getUserIdFromToken(accessToken);
    return { kakao_user_id: kakaoUserId };
  }

  @Post('jwt')
  async generateJwt(@Body('kakao_user_id') kakaoUserId: number) {
    if (!kakaoUserId) {
      throw new Error();
    }
    const jwt = await this.gongsilAuthService.generateJwt(kakaoUserId);

    return { jwt };
  }
}
