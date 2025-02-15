import { BadRequestException, Controller, Get, Query, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthProvider } from './enum/auth-provider.enum';
import { AuthTokensDto } from './dto/auth.dto';
import { generateRandomNickname } from './utils/random-nickname.util';

type RequestWithUser = Request & { user?: { idx: number } };

const providerMap: Record<string, AuthProvider> = {
  kakao: AuthProvider.KAKAO,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * ✅ 특정 소셜 로그인 페이지로 Redirect (ex: Kakao, Google, Apple)
   * @param provider 로그인 제공자 (ex: kakao, google, apple)
   */
  @Public()
  @Get(':provider/redirect')
  async redirectToSocialLogin(@Param('provider') provider: string): Promise<{ redirectUri: string }> {
    const socialProvider = providerMap[provider.toLowerCase()];
    if (socialProvider === undefined) {
      throw new BadRequestException('지원하지 않는 로그인 제공자입니다.');
    }

    return { redirectUri: this.authService.getAuthLoginUrl(socialProvider) };
  }

  /**
   * ✅ 특정 소셜 로그인 Callback
   * @param provider 로그인 제공자 (ex: kakao, google, apple)
   * @param code OAuth 인증 코드
   */
   @Public()
  @Get(':provider/callback')
  async loginWithSocial(@Param('provider') provider: string, @Query('code') code: string): Promise<AuthTokensDto> {
    if (!code) {
      throw new BadRequestException('코드가 존재하지 않음');
    }

    const socialProvider = providerMap[provider.toLowerCase()];
    if (socialProvider === undefined) {
      throw new BadRequestException('지원하지 않는 로그인 제공자입니다.');
    }

    return this.authService.login(socialProvider, code);
  }

  /**
   * ✅ JWT 인증 테스트 API
   * @param req 인증된 사용자 정보
   */
  @Get('test')
  async testAuth(@Req() req: RequestWithUser) {
    return {
      message: 'test',
      userIdx: req.user?.idx,
    };
  }

  /**
   * ✅ 랜덤 닉네임 생성 API
   */
  @Public()
  @Get('random-nickname')
  async getRandomNickname() {
    return generateRandomNickname();
  }
}
