import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GongsilAuthService {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async getKakaoAccessToken(code: string) {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';

    // 카카오에서 요구하는 http 요청 형식에 맞게 바꿔줌줌
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'f355f7b93ff5945f5349d6d2f7f49b49',
      redirect_uri: 'http://localhost:3000/auth/kakao/callback',
      code: code,
    });

    try {
      const res = await firstValueFrom(
        this.httpService.post(tokenUrl, payload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      return res.data;
    } catch (error) {
      console.error(
        '카카오 토큰 요청 실패:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('토큰 요청 실패');
    }
  }

  async generateJwtToken(accessToken: string): Promise<string> {
    const payload = {
      accessToken,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }
}
