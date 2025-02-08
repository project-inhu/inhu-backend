import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth_service';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';

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
  async kakaoLogin() {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code
    &client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}
    &redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URL')}`;

    return { url: kakaoLoginUrl };
  }
  @Public()
  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string) {
    if (!code) {
      throw new UnauthorizedException('인가 코드가 없습니다.');
    }

    const kakaoToken = await this.authService.getKakaoAccessToken(code);
    const kakaoUser = await this.authService.getKakaoUser(
      kakaoToken.access_token,
    );
    const userProvider = await this.authService.authenticateKakaoUser(
      kakaoUser.id.toString(),
    );
    const jwt = await this.authService.generateJwt(userProvider.idx);
    return {
      jwt,
    };
  }
}
