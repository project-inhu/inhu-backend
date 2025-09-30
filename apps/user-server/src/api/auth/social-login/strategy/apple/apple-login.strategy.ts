import { Injectable } from '@nestjs/common';
import { ISocialLoginStrategy } from '../../ISocialLogin-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { Request } from 'express';
import { GetAppleTokenResponseDto } from './dto/get-apple-token-response.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { GetAppleDecodedDto } from './dto/get-apple-decoded.dto';
import { verify } from 'jsonwebtoken';
import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { RedisService } from '@libs/common/modules/redis/redis.service';

@Injectable()
export class AppleLoginStrategy implements ISocialLoginStrategy {
  private readonly TEAM_ID: string;
  private readonly APPLE_CLIENT_ID: string;
  private readonly APPLE_REDIRECT_URI: string;
  private readonly jwksClient: JwksClient;
  private readonly APPLE_KEY_ID: string;
  private readonly APPLE_PRIVATE_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.TEAM_ID = this.configService.get<string>('APPLE_TEAM_ID') ?? '';
    this.APPLE_CLIENT_ID =
      this.configService.get<string>('APPLE_CLIENT_ID') ?? '';
    this.APPLE_REDIRECT_URI =
      this.configService.get<string>('APPLE_REDIRECT_URI') ?? '';
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
    this.APPLE_KEY_ID = this.configService.get<string>('APPLE_KEY_ID') ?? '';
    this.APPLE_PRIVATE_KEY =
      this.configService.get<string>('APPLE_PRIVATE_KEY') ?? '';
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
    const clientSecret = await this.getAppleClientSecret();
    const appleIdToken = await this.getAppleIdToken(req, clientSecret);
    const decodedToken = await this.decodeIdToken(appleIdToken);

    return {
      snsId: decodedToken.sub,
      provider,
    };
  }

  private async getAppleClientSecret(): Promise<string> {
    let clientSecret = await this.redisService.get('apple-client-secret');

    if (!clientSecret) {
      const exp = 30 * 24 * 60 * 60;
      const clientSecretOptions: JwtSignOptions = {
        algorithm: 'ES256',
        audience: 'https://appleid.apple.com',
        issuer: this.TEAM_ID,
        subject: this.APPLE_CLIENT_ID,
        keyid: this.APPLE_KEY_ID,
        secret: this.APPLE_PRIVATE_KEY,
        expiresIn: exp,
      };
      clientSecret = this.jwtService.sign({}, clientSecretOptions);
      await this.redisService.set(
        'apple-client-secret',
        clientSecret,
        'EX',
        exp,
      );
    }

    return clientSecret;
  }

  private async getAppleIdToken(
    req: Request,
    clientSecret: string,
  ): Promise<string> {
    const code = req.body.code;

    const result =
      await this.httpService.axiosRef.post<GetAppleTokenResponseDto>(
        'https://appleid.apple.com/auth/token',
        new URLSearchParams({
          client_id: this.APPLE_CLIENT_ID,
          client_secret: clientSecret,
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
