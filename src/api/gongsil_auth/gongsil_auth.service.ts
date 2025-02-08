import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './gongsil_auth.repository';
import { UserProvider } from '@prisma/client';

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
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('사용자 정보 조회 실패');
    }
  }

  async authenticateKakaoUser(kakoUserId: string) {
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

  async generateJwt(userId: number) {
    try {
      const payload = {
        sub: userId,
      };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1m',
      });
    } catch (error) {
      throw new UnauthorizedException('jwt 토큰 발급 실패');
    }
  }
}
