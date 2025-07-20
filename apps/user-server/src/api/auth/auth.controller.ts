import { AuthProvider } from '@libs/core';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AuthService } from '@user/api/auth/auth.service';
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

  @Get('/:provider/callback')
  public async socialLogin(
    @Req() req: Request,
    @Param('provider') provider: AuthProvider,
  ) {}
}
