import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';

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
      throw new UnauthorizedException('토큰 요청 실패');
    }
  }

  //accessToken으로 사용자 id 조회
  async getUserIdFromToken(accessToken: string) {
    const url = 'https://kapi.kakao.com/v1/user/access_token_info';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      console.log(response.data.id);
      return response.data.id;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
