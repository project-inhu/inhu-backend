import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth_repository';
import { UserProvider } from '@prisma/client';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async loginWithKakao(code: string) {
    const kakaoToken = await this.getKakaoToken(code);

    const kakaoUser = await this.getKakaoUser(kakaoToken.access_token);

    const kakaoUserId = kakaoUser.id.toString();

    await this.authenticateKakaoUser(kakaoUserId);

    await this.saveKakaoRefreshToken(kakaoUserId, kakaoToken.refresh_token);

    const accessToken = await this.generateAccessJwt(kakaoUserId);
    const refreshToken = await this.generateRefreshJwt(kakaoUserId);

    return { accessToken, refreshToken };
  }

  //카카오 token 요청
  async getKakaoToken(code: string): Promise<kakaoToken> {
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

  //카카오 사용자 정보 조회
  async getKakaoUser(accessToken: string): Promise<kakaoUser> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('사용자 정보 조회 실패');
    }
  }

  // 유저 인증 및 회원가입
  async authenticateKakaoUser(kakoUserId: string): Promise<UserProvider> {
    // kakaoUserId = snsId
    try {
      let userProvider: UserProvider | null =
        await this.authRepository.selectKakaoUser(kakoUserId);

      if (!userProvider) {
        //회원가입
        const user = await this.authRepository.insertUser();
        userProvider = await this.authRepository.inserUserProvider(
          user.idx,
          kakoUserId,
        );
      }
      return userProvider;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('잘못된 정보');
      }
      throw new InternalServerErrorException('인증 실패패');
    }
  }

  //서버 refresh token 생성
  async generateRefreshJwt(userId: string): Promise<string> {
    // userId = snsId
    try {
      const payload = {
        sub: userId,
      };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      });
      console.log('생성된 refresh', token);
      return token;
    } catch (error) {
      throw new UnauthorizedException('refresh jwt 토큰 발급 실패');
    }
  }

  //서버 access token 생성성
  async generateAccessJwt(userId: string): Promise<string> {
    // userId = snsId
    try {
      const payload = {
        sub: userId,
      };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10s',
      });
    } catch (error) {
      throw new UnauthorizedException('acess jwt 토큰 발급 실패');
    }
  }

  //카카오 refresh token을 DB에 저장장
  async saveKakaoRefreshToken(
    userId: string,
    kakaoRefreshToken: string,
  ): Promise<void> {
    await this.authRepository.insertKakaoRefreshToken(
      userId,
      kakaoRefreshToken,
    );
  }

  //토큰 재발급급
  async refreshTokens(req: Request) {
    const serverRefreshToken = req.cookies['RefreshToken'];
    if (!serverRefreshToken) {
      throw new UnauthorizedException('Refresh Token이 없습니다.');
    }

    //jwt에서 snsId 추출
    console.log('검증할 server refreshtoken', serverRefreshToken);
    const snsId = await this.verifyRefreshJwt(serverRefreshToken);
    console.log('추출된 snsId', snsId);

    //DB에서 카카오 refresh token 조회
    const kakaoRefreshToken = await this.getKakaoRefreshToken(snsId);

    //카카오 refresh token을 사용해 token 재발급 요청청
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
      console.log('검증 시작', serverRefreshToken);
      const decoded = this.jwtService.verify(serverRefreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.log('디코딩 성공', decoded);
      return decoded.sub;
    } catch (error) {
      console.log(error.message);
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

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('kakao access token 재발급 실패');
    }
  }
}
