import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { KakaoAccessTokenDto, KakaoUserInfoDto } from './dto/kakao.dto';
import { LoginResponseDto } from './dto/auth.dto';

// TODO : dto 만들고 return type 명시 / repository로 sql 빼기 / 개방 폐쇄 원칙 반영하여 코드 리팩토링 
// TODO : 랜덤 닉네임 생성 함수 / user dto 만들때 extends 사용하기

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithKakao(code: string): Promise<LoginResponseDto> {
    // 1. 카카오 API를 통해 Access Token 가져오기
    const accessToken = await this.getKakaoAccessToken(code);

    // 2. Access Token으로 카카오 사용자 정보 가져오기
    const userInfo = await this.getKakaoUserInfo(accessToken.access_token);

    // 3. 유저 정보 조회 및 신규 유저 등록
    const userProvider = await this.findOrCreateUser(userInfo);

    // 4. JWT 발급
    const jwtToken = this.generateJwtToken(userProvider.idx);

    return { accessToken: jwtToken };
  }

  private async getKakaoAccessToken(code: string): Promise<KakaoAccessTokenDto> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.KAKAO_CLIENT_ID || '');
    params.append('redirect_uri', process.env.KAKAO_REDIRECT_URI || '');
    params.append('code', code);

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    );

    return tokenResponse.data;
  }

  private async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    const userInfoResponse = await firstValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return userInfoResponse.data;
  }

  private async findOrCreateUser(userInfo: any): Promise<any> {
    const snsId = String(userInfo.id); // 카카오 고유 식별값
    const nickname = 'random'; // TODO: 랜덤 닉네임 생성 함수 추가

    let userProvider = await this.prisma.userProvider.findFirst({
      where: { snsId, provider: 0 }, // provider 0: 카카오
      include: { user: true },
    });

    if (!userProvider) {
      const newUser = await this.prisma.user.create({
        data: {
          nickname,
          createdAt: new Date(),
        },
      });

      userProvider = await this.prisma.userProvider.create({
        data: {
          snsId,
          provider: 0,
          idx: newUser.idx,
        },
        include: { user: true },
      });
    }

    return userProvider;
  }

  private generateJwtToken(idx: number): string {
    const payload = { idx };
    return this.jwtService.sign(payload);
  }
}
