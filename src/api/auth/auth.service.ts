import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoToken(code: string): Promise<KakaoTokenType> {
    try {
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
    } catch (error) {
      throw new UnauthorizedException('토큰 발급 실패');
    }
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfoType> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('정보 조회 실패');
    }
  }

  async authenticateKakaoUser(kakaoUserInfo: any): Promise<UserProvider> {
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException('데이터베이스 제약 조건 위반');
      } else if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('유효하지 않은 데이터 입력');
      } else {
        throw new InternalServerErrorException('500 error');
      }
    }
  }

  async makeJwtToken(user: any): Promise<{ access_token: string }> {
    try {
      const payload = { userIdx: user.idx };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('jwt 토큰 발급 실패');
    }
  }
}
