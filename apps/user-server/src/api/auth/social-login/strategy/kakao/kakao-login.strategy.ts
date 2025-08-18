import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISocialLoginStrategy } from '@user/api/auth/social-login/ISocialLogin-strategy.interface';
import { GetKakaoTokenResponseDto } from '@user/api/auth/social-login/strategy/kakao/dto/get-kakao-token-response.dto';
import { GetKakaoUserInfoResponseDto } from '@user/api/auth/social-login/strategy/kakao/dto/get-kakao-user-info-response.dto';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { Request } from 'express';

@Injectable()
export class KakaoLoginStrategy implements ISocialLoginStrategy {
  private readonly KAKAO_CLIENT_ID: string;
  private readonly KAKAO_REDIRECT_URI: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.KAKAO_CLIENT_ID =
      this.configService.get<string>('KAKAO_CLIENT_ID') ?? '';
    this.KAKAO_REDIRECT_URI =
      this.configService.get<string>('KAKAO_REDIRECT_URI') ?? '';
  }

  public getSocialLoginRedirect(): string {
    return (
      `https://kauth.kakao.com/oauth/authorize` +
      '?response_type=code&' +
      `redirect_uri=${this.KAKAO_REDIRECT_URI}&` +
      `client_id=${this.KAKAO_CLIENT_ID}`
    );
  }

  public async socialLogin(
    provider: AuthProvider,
    req: Request,
  ): Promise<OAuthInfo> {
    const kakaoAccessToken = await this.getKakaoAccessToken(req);

    const { data } =
      await this.httpService.axiosRef.get<GetKakaoUserInfoResponseDto>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

    return {
      snsId: data.id.toString(),
      provider,
    };
  }

  private async getKakaoAccessToken(request: Request): Promise<string> {
    if (request.query.token) {
      return request.query.token as string;
    }

    const code = request.query.code as string;
    const result =
      await this.httpService.axiosRef.post<GetKakaoTokenResponseDto>(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.KAKAO_CLIENT_ID,
          redirect_uri: this.KAKAO_REDIRECT_URI,
          code: encodeURIComponent(code),
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    return result.data.access_token;
  }
}
