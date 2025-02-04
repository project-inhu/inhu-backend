import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './gongsil_auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Public()
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
    const kakaoToken = await this.authService.getKakaoAccessToken(code);

    return { access_token: kakaoToken };
  }

  @Get('extractUser')
  async extractUser(@Body('access_token') accessToken: string) {
    const kakaoUserId = await this.authService.getUserIdFromToken(accessToken);
    return { kakao_user_id: kakaoUserId };
  }

  @Post('jwt')
  async generateJwt(@Body('kakao_user_id') kakaoUserId: number) {
    if (!kakaoUserId) {
      throw new Error();
    }
    const jwt = await this.authService.generateJwt(kakaoUserId);

    return { jwt };
  }
}
