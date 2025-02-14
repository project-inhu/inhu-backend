import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { SocialAuthFactory } from './social-auth.factory';
import axios from 'axios';

//TODO
//함수명 바꾸기 특히 refreshTokens...
//consolog log 지우기
//try catch 없애기
//json도 더 nestjs스럽게...

@Controller('auth')
@UseGuards(AuthGuard)
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
    const { accessToken, refreshToken } =
      await this.authService.reissueRefreshTokens(req);

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
