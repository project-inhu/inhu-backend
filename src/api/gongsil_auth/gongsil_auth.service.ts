import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './gongsil_auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async getKakaoAccessToken(code: string) {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';

    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') || '',
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URL') || '',
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
  async getKakaoUser(accessToken: string) {
    const url = 'https://kapi.kakao.com/v2/user/me';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async authenticateKakaoUser() {}

  async generateJwt(kakaoUserId: number) {
    const payload = {
      sub: kakaoUserId,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1m',
    });
  }
}
