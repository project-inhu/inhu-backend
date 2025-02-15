import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { SocialAuthFactory } from './factories/social-auth.factory';

//TODO
//함수명 바꾸기 특히 refreshTokens...
//consolog log 지우기
//try catch 없애기
//json도 더 nestjs스럽게...

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly socialAuthFactory: SocialAuthFactory,
  ) {}

  @Public()
  @Get(':provider/login')
  socialLogin(@Param('provider') provider: string, @Res() res: Response) {
    const socialAuthService = this.socialAuthFactory.getAuthService(provider);
    return res.redirect(socialAuthService.getLoginUrl());
  }

  @Public()
  @Get(':provider/callback')
  async callBack(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.socialLogin(
      code,
      provider,
    );

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

    return res.redirect('http://localhost:3000/auth/test');
  }

  @Get('test')
  async test() {
    return { message: '인증 성공' };
  }

  @Public()
  @Get('reissue')
  async reissueToken(@Req() req: Request, @Res() res: Response) {
    console.log('재발급 실행이요');
    const accessToken = await this.authService.reissueToken(
      req.cookies['RefreshToken'],
    );

    res.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.redirect('http://localhost:3000/auth/test');
  }
  // 이 컨트롤러에서 catch로 error 받고, logout service 호출...
  // logout service를 만들자.
  // 이 아래 API 호출 말고고

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('AccessToken');
    res.clearCookie('RefreshToken');
    return res.redirect('http://localhost:3000/auth/login-page');
  }
}
