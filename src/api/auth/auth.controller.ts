import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('kakao-login')
  kakaoRedirect(
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const uri =
      'https://kauth.kakao.com/oauth/authorize?' +
      'response_type=code&' +
      `redirect_uri=${process.env.KAKAO_REDIRECT_URI}&` +
      `client_id=${process.env.KAKAO_CLIENT_ID}`;

    res.redirect(uri);
  }

  @Public()
  @Get('kakao/callback')
  async kakaoAuth(@Query('code') code: string, @Res() res: Response) {
    const kakaoToken = await this.authService.getKakaoToken(code);
    const kakaoUserInfo = await this.authService.getKakaoUserInfo(
      kakaoToken.access_token,
    );
    const user = await this.authService.authenticateKakaoUser(kakaoUserInfo);
    const accessToken = await this.authService.makeAccessToken(user.idx);
    const refreshToken = await this.authService.makeRefreshToken(user.idx);

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
