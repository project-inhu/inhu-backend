import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'apps/admin-server/src/api/auth/auth.service';
import { getCookieConfig } from 'apps/admin-server/src/api/auth/config/cookie.config';
import { LoginDto } from 'apps/admin-server/src/api/auth/dto/request/login.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인 Endpoint
   */
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = await this.authService.login(dto.id, dto.pw);

    res.cookie('token', `Bearer ${token}`, getCookieConfig());
  }

  /**
   * 로그아웃 Endpoint
   */
  @Post('/logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('token', getCookieConfig());
  }
}
