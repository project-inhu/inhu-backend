import { AuthProvider } from '@libs/core';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AuthService } from '@user/api/auth/auth.service';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/:provider/login')
  public async getSocialLoginRedirect(
    @Res() res: Response,
    @Param('provider') provider: AuthProvider,
  ) {
    const url = await this.authService.getSocialLoginRedirect(provider);

    res.redirect(url);
  }

  @Get('/:provider/callback/app')
  public async socialLogin(
    @Req() req: Request,
    @Param('provider') provider: AuthProvider,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req,
      provider,
      TokenIssuedBy.APP,
    );

    return { accessToken, refreshToken };
  }
}
