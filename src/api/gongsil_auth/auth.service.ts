import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { UserProvider } from '@prisma/client';
import { Request, Response } from 'express';
import { SocialAuthFactory } from './social-auth.factory';
import { UserPayloadInfoDto } from './user-payload-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly socialAuthFactory: SocialAuthFactory,
  ) {}

  async socialLogin(code: string, provider: string) {
    const socialAuthService = this.socialAuthFactory.getAuthService(provider);

    const token = await socialAuthService.getToken(code);

    const socialUserInfo = await socialAuthService.getUserInfo(
      token.access_token,
    );

    const extractedUserInfo =
      await socialAuthService.extractUserInfo(socialUserInfo);

    const user = await this.authenticateKakaoUser(extractedUserInfo);

    await this.saveKakaoRefreshToken(user.idx, token.refresh_token);

    const accessToken = await this.generateAccessToken(user.idx);
    const refreshToken = await this.generateRefreshToken(user.idx);

    return { accessToken, refreshToken };
  }

  async authenticateKakaoUser(
    userPayloadInfoDto: UserPayloadInfoDto,
  ): Promise<UserProvider> {
    const snsId = userPayloadInfoDto.id;
    let userProvider: UserProvider | null =
      await this.authRepository.selectKakaoUser(snsId);

    if (!userProvider) {
      const user = await this.authRepository.insertUser();
      userProvider = await this.authRepository.inserUserProvider(
        user.idx,
        userPayloadInfoDto.provider,
        snsId,
      );
    }

    return userProvider;
  }

  async generateRefreshToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15s',
    });
  }

  async generateAccessToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '10s',
    });
  }

  async saveKakaoRefreshToken(
    idx: number,
    refreshToken: string,
  ): Promise<UserProvider> {
    return await this.authRepository.updateUserRefreshTokenByIdx(
      idx,
      refreshToken,
    );
  }

  //토큰 재발급
  async reissueToken(req: Request) {
    const serverRefreshToken = req.cookies['RefreshToken'];
    const snsId = await this.verifyRefreshJwt(serverRefreshToken);
    const kakaoRefreshToken = await this.getKakaoRefreshToken(snsId);
    const newKakaoToken = await this.refreshKakaoToken(kakaoRefreshToken);

    if (newKakaoToken.refresh_token) {
      await this.saveKakaoRefreshToken(snsId, newKakaoToken.refresh_token);
    }

    const newRefreshToken = await this.generateRefreshJwt(snsId);
    const newAccessToken = await this.generateAccessJwt(snsId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  //서버 refresh jwt에서 사용자 정보 추출출
  async verifyRefreshJwt(serverRefreshToken: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(serverRefreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return decoded.sub;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh Token 만료됨');
      }
      throw new UnauthorizedException('유효하지 않은 Refresh Token');
    }
  }

  //사용자 정보에 맞는 카카오 refresh token DB에서 추출출
  async getKakaoRefreshToken(snsId: string): Promise<string> {
    const kakaoRefreshToken =
      await this.authRepository.getKakaoRefreshToken(snsId);
    if (!kakaoRefreshToken) {
      throw new UnauthorizedException('카카오 Refresh Token이 없습니다.');
    }
    return kakaoRefreshToken;
  }

  //카카오 토큰 재발급급
  async refreshKakaoToken(kakaoRefreshToken: string) {
    const url = 'https://kauth.kakao.com/oauth/token';

    const payload = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') || '',
      refresh_token: kakaoRefreshToken,
    });

    const response = await firstValueFrom(
      this.httpService.post(url, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    if (response.status !== 200) {
      throw response.data;
    }

    return response.data;
  }
}
