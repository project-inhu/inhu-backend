import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor() {}

  @Get('/:provider/login')
  public async getSocialLoginRedirect(
    @Req() req: Request,
    @Param('provider') provider: string,
  ) {}

  @Get('/:provider/callback')
  public async socialLogin(
    @Req() req: Request,
    @Param('provider') provider: string,
  ) {}
}
