import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

// TODO : 로그인시 DB에서 사용자 조회 후 없으면 등록 / JWT 발급 / AuthGuard로 다른 API에서 검증하는 로직

@Injectable()
export class HeejuAuthService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async loginWithKakao(code: string): Promise<any> {
    const params = new URLSearchParams(); // URLSearchParams 객체 생성
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.KAKAO_CLIENT_ID || '');
    params.append('redirect_uri', process.env.KAKAO_REDIRECT_URI || '');
    params.append('code', code);

    // 1. 카카오 API를 통해 Access Token 가져오기
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        params.toString(), // URLSearchParams를 문자열로 변환
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 카카오 API를 통해 유저 정보 가져오기
    const userInfoResponse = await firstValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Access Token 전달
        },
      }),
    );

    const snsId = String(userInfoResponse.data.id); // 카카오 고유 식별값

    return snsId;
      
    
  }
}
