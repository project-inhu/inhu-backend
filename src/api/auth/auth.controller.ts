import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SocialAuthFactory } from './factories/social-auth.factory';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialAuthFactory: SocialAuthFactory,
  ) {}

  @Public()
  @Get(':provider/login')
  socialLogin(
    @Param('provider') provider: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialProviderService =
      this.socialAuthFactory.getAuthService(provider);

    res.redirect(socialProviderService.getAuthLoginUrl());
  }

  @Public()
  @Get(':provider/callback')
  async kakaoAuth(
    @Query('code') code: string,
    @Param('provider') provider: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.handleSocialLogin(code, provider);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    const url = 'http://localhost:3000/public';
    return res.redirect(url);
  }

  @Public()
  @Get('/reissue')
  async handleTokenReissue(@Req() req: Request, @Res() res: Response) {
    console.log(req.cookies);
    try {
      const { accessToken, refreshToken } = await this.authService.makeNewToken(
        req.cookies?.refreshToken,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      const url = 'http://localhost:3000/public';
      return res.redirect(url);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
