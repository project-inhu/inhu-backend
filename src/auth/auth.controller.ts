import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { AuthProvider } from './enum/auth-provider.enum';
import { provider } from './decorators/provider.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get(':provider/login')
  socialLogin(@provider() provider: AuthProvider, @Res() res: Response): void {
    const socialAuthService = this.authService.getAuthService(provider);
    return res.redirect(socialAuthService.getLoginUrl());
  }

  @Public()
  @Get(':provider/callback')
  async callBack(
    @provider() provider: AuthProvider,
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

  @Get('test')
  async test() {
    return { message: '인증 성공' };
  }

  @Public()
  @Get('test/main')
  async maintest() {
    return { message: '여기는 로그인 메인 페이지가 될 것이다' };
  }

  @Public()
  @Get('reissue')
  async reissueToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const accessToken: string = await this.authService.reissueToken(
      req.cookies['RefreshToken'],
    );

    res.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.redirect('http://localhost:3000/auth/test');
  }
}
