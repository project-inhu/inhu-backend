import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private clientId: string;
  private redirectUrl: string;

  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
    this.clientId = this.configService.get<string>('KAKAO_CLIENT_ID') || '';
    this.redirectUrl =
      this.configService.get<string>('KAKAO_REDIRECT_URL') || '';
  }

  async getKakaoAccessToken(code: string) {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';

    // 카카오에서 요구하는 http 요청 형식에 맞게 바꿔줌줌
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
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

  async generateJwt(kakaoUserId: number) {
    const payload = {
      sub: kakaoUserId,
    };
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1m',
    });
  }
}
