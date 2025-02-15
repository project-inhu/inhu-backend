import { BadRequestException, Controller, Get, Query, Req, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthTokensDto } from './dto/auth.dto';
import { Response } from 'express'; // ✅ express의 Response 사용

type RequestWithUser = Request & { user?: { idx: number } };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get(':provider/redirect')
  async redirectToSocialLogin(@Param('provider') provider: string, @Res() res:Response) {
    const socialAuthService = this.authService.getAuthService(provider);    
    const redirectUri = socialAuthService.getAuthLoginUrl();

    return res.redirect(redirectUri);
  }

  @Public()
  @Get(':provider/callback')
  async loginWithSocial(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response
  ) {
    if (!code) {
      throw new BadRequestException('코드가 존재하지 않음');
    }

    const { jwtAccessToken, jwtRefreshToken } = await this.authService.login(provider, code);

    res.cookie('accessToken', jwtAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', jwtRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    const redirectUrl = 'http://localhost:3000';
    return res.redirect(redirectUrl);
  }

  @Get('test')
  async testAuth(@Req() req: RequestWithUser) {
    return {
      message: 'test',
      userIdx: req.user?.idx,
    };
  }
}
