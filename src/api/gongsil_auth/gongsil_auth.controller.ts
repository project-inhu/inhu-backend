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

  // redirect url (인가 코드 전달됨)
  @Get('kakao/callback')
  // 인가 코드를 받아 엑세스 토큰 요청
  async kakaoCallback(@Query('code') code: string) {}

  @Post('kakao/getToken')
  async kakaoGetToken(@Body('code') code: string) {
    const kakaoToken = await this.gongsilAuthService.getKakaoAccessToken(code);

    const jwt = await this.gongsilAuthService.generateJwtToken(
      kakaoToken.access_token,
    );
    console.log(jwt);
    return { jwt };
  }
}
