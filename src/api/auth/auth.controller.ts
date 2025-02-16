import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './service/auth.service';
import { Public } from './common/decorators/public.decorator';
import { AuthProvider } from './enum/auth-provider.enum';
import { SocialAuthBaseStrategy } from './base/social-auth-base.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { AuthProviderPipe } from './common/pipes/auth-provider.pipe';

/**
 * 인증 관련 API를 관리하는 컨트롤러
 * - 소셜 로그인
 * - 액세스 토큰 및 리프레시 토큰 발급
 */
@Controller('auth')
export class AuthController {
  /**
   * 소셜 로그인 제공자 매핑 정보
   * - AuthProvider(enum) 값에 해당하는 로그인 전략을 저장
   */
  private readonly SOCIAL_LOGIN_MAP: Record<
    AuthProvider,
    SocialAuthBaseStrategy
  >;

  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoStrategy,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
    };
  }

  /**
   * 소셜 로그인 요청을 처리하는 엔드포인트
   * - 사용자가 로그인 요청을 하면 해당 소셜 로그인 제공자의 인증 URL로 리다이렉트
   * @param provider 소셜 로그인 제공자 (ex: kakao)
   * @param res 응답 객체 (리다이렉트를 위해 사용됨)
   */
  @Public()
  @Get(':provider/login')
  socialLogin(
    @Param('provider', AuthProviderPipe) provider: AuthProvider,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialProviderService = this.SOCIAL_LOGIN_MAP[provider];

    res.redirect(socialProviderService.getAuthLoginUrl());
  }

  /**
   * 소셜 로그인 인증 후 콜백을 처리하는 엔드포인트
   * - 소셜 로그인 성공 시, 액세스 토큰과 리프레시 토큰을 발급
   * - 쿠키에 토큰을 저장한 후, 프론트엔드 페이지로 리다이렉트
   * @param code 소셜 로그인 인증 코드
   * @param provider 로그인 제공자 (ex: kakao)
   * @param res 응답 객체 (쿠키 설정 및 리다이렉트 처리)
   */
  @Public()
  @Get(':provider/callback')
  async kakaoAuth(
    @Query('code') code: string,
    @Param('provider', AuthProviderPipe) provider: AuthProvider,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.handleSocialLogin(code, provider);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    const url = 'http://localhost:3000/public';
    return res.redirect(url);
  }
}
