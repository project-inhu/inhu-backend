import { Injectable } from '@nestjs/common';
import { ISocialLoginStrategy } from '../../ISocialLogin-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthProvider } from '@libs/core';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { Request } from 'express';
import { GetAppleTokenResponseDto } from './dto/get-apple-token-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { GetAppleDecodedDto } from './dto/get-apple-decoded.dto';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AppleLoginStrategy implements ISocialLoginStrategy {
  private readonly APPLE_CLIENT_ID: string;
  private readonly APPLE_CLIENT_SECRET: string;
  private readonly APPLE_REDIRECT_URI: string;
  private readonly jwksClient: JwksClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.APPLE_CLIENT_ID =
      this.configService.get<string>('APPLE_CLIENT_ID') ?? '';
    this.APPLE_CLIENT_SECRET =
      this.configService.get<string>('APPLE_CLIENT_SECRET') ?? '';
    this.APPLE_REDIRECT_URI =
      this.configService.get<string>('APPLE_REDIRECT_URI') ?? '';
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
  }

  public getSocialLoginRedirect(): string {
    return (
      'https://kauth.kakao.com/oauth/authorize' +
      `?client_id=${this.APPLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(this.APPLE_REDIRECT_URI)}&` +
      'response_type=code&' +
      'scope=name%20email&' +
      'response_mode=form_post&' +
      'state=a_random_csrf_token_string_12345&' +
      'nonce=another_random_string_for_nonce_67890'
    );
  }

  public async socialLogin(
    provider: AuthProvider,
    req: Request,
  ): Promise<OAuthInfo> {
    const appleIdToken = await this.getAppleIdToken(req);
    const decodedToken = await this.decodeIdToken(appleIdToken);

    return {
      snsId: decodedToken.sub,
      provider,
    };
  }

  private async getAppleIdToken(req: Request): Promise<string> {
    const code = req.body.code;

    const result =
      await this.httpService.axiosRef.post<GetAppleTokenResponseDto>(
        'https://appleid.apple.com/auth/token',
        new URLSearchParams({
          client_id: this.APPLE_CLIENT_ID,
          client_secret: this.APPLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.APPLE_REDIRECT_URI,
        }),
      );
    return result.data.id_token;
  }

  private async decodeIdToken(idToken: string): Promise<GetAppleDecodedDto> {
    const decodedToken = this.jwtService.decode(idToken, { complete: true });

    const kid = decodedToken.header.kid;
    const signingKey = await this.jwksClient.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    return verify(idToken, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: this.APPLE_CLIENT_ID,
    }) as GetAppleDecodedDto;
  }
}
