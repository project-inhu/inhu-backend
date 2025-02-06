import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// TODO : 기능별로 함수 나누기 / dto 만들기 / repository로 sql 빼기 / 개방 폐쇄 원칙 반영하여 코드 리팩토링 
// TODO : 랜덤 닉네임 생성 함수 / user dto 만들때 extends 사용하기

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
    private jwtService : JwtService
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
      // String 말고 toString으로
      const nickname = 'random'; // TODO : 랜덤 닉네임 생성 함수 만들기

      let userProvider = await this.prisma.userProvider.findFirst({
          where: { snsId, provider: 0 }, // Q. provider 0인게 카카오 로그인이라고 가정
          include : {user:true}
      })

      // 3. 신규유저라면 DB에 저장
      if (!userProvider) {
          const newUser = await this.prisma.user.create({
              data: {
                  nickname,
                  createdAt : new Date()
              }
          })

          userProvider = await this.prisma.userProvider.create({
              data: {
                  snsId,
                  provider: 0,
                  idx : newUser.idx
              },
              include: {
                  user: true
              }
          })
      }

      // 4. JWT 발급
      const payload = { idx: userProvider.idx };
      const jwtToken = this.jwtService.sign(payload);

      return { accessToken: jwtToken };

  }
}
