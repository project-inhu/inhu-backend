import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';
import { AuthProvider } from './enum/auth-provider.enum';
import { Provider } from './decorators/provider.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 소셜 로그인 요청을 처리하는 엔드포인트
   * - 해당 소셜 로그인 페이지로 리다이렉트한다.
   *
   * @param provider 로그인할 소셜 플랫폼 (예: KAKAO, GOOGLE 등)
   * @param res 응답 객체
   * @returns 해당 소셜 로그인 URL로 리디렉트
   *
   * @author 강정연
   */
  @Public()
  @Get(':provider/login')
  socialLogin(@Provider() provider: AuthProvider, @Res() res: Response): void {
    const socialAuthService = this.authService.getAuthService(provider);
    return res.redirect(socialAuthService.getLoginUrl());
  }

  /**
   * 소셜 로그인 콜백 처리 엔드포인트트
   * - 소셜 로그인 후, 반환된 인증 코드를 이용하여
   *   JWT access 및 refresh token을 발급해 쿠키에 저장한다.
   *
   * @param provider 로그인할 소셜 플랫폼 (예: KAKAO, GOOGLE 등)
   * @param res 응답 객체
   * @param code 소셜 로그인 후 반환된 인증 코드
   * @returns 메인 페이지로 리디렉트
   *
   * @author 강정연
   */
  @Public()
  @Get(':provider/callback')
  async callBack(
    @Provider() provider: AuthProvider,
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.socialLogin(
      code,
      provider,
    );

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

    return res.redirect('http://localhost:3000/auth/test');
  }
}
