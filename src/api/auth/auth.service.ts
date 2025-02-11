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
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoToken(code: string): Promise<KakaoToken> {
    try {
      const response = await axios.post<KakaoToken>(
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
      );

      if (!response?.data) {
        throw new UnauthorizedException('토큰 발급 실패');
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Something is wrong');
    }
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }),
      );

      if (!response?.data) {
        throw new UnauthorizedException('정보 조회 실패');
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Something is wrong!!');
    }
  }

  async authenticateKakaoUser(
    kakaoUserInfo: KakaoUserInfo,
  ): Promise<UserProvider> {
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
        throw new InternalServerErrorException('Something is wrong!!');
      }
    }
  }

  async makeAccessToken(user: number): Promise<string> {
    try {
      const payload = { userIdx: user };
      return this.jwtService.sign(payload, { expiresIn: '3s' });
    } catch (error) {
      throw new UnauthorizedException('access token 발급 실패');
    }
  }

  async makeRefreshToken(user: number): Promise<string> {
    try {
      const payload = { userIdx: user };
      return this.jwtService.sign(payload, { expiresIn: '1m' });
    } catch (error) {
      throw new UnauthorizedException('refresh token 발급 실패');
    }
  }

  async makeNewToken(refreshToken: string): Promise<tokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('refresh 토큰 없음');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const userIdx = payload.userIdx;

      const blackList =
        await this.authRepository.selectBlackListByRefreshToken(refreshToken);
      if (blackList) {
        throw new UnauthorizedException('black list 입니다');
      }

      const user = await this.authRepository.selectUserByIdx(userIdx);

      if (user?.refreshToken !== refreshToken) {
        await this.authRepository.insertBlackList(refreshToken);
        throw new UnauthorizedException('attacker 입니다');
      }

      const newAccessToken = await this.makeAccessToken(userIdx);
      const newRefreshToken = await this.makeRefreshToken(userIdx);
      await this.authRepository.updateUserRefreshTokenByIdx(
        userIdx,
        newRefreshToken,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('재로그인하세요.');
      }
      throw new UnauthorizedException();
    }
  }
}
