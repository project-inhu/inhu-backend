import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoToken(code: string): Promise<KakaoTokenType> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID ?? '',
          redirect_uri: process.env.KAKAO_REDIRECT_URI ?? '',
          code: code,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    return response.data;
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfoType> {
    const response = await firstValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }),
    );

    return response.data;
  }

  async authenticateKakaoUser(kakaoUserInfo: any): Promise<UserProvider> {
    const kakaoId = kakaoUserInfo.id.toString();
    let userProvider: UserProvider | null =
      await this.authRepository.selectKakaoId(kakaoId);

    if (!userProvider) {
      const user = await this.authRepository.insertUser();
      userProvider = await this.authRepository.insertUserProviderByKakao(
        user.idx,
        kakaoId,
      );
    }

    return userProvider;
  }

  async makeJwtToken(user: any): Promise<{ access_token: string }> {
    const payload = { userIdx: user.idx };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
