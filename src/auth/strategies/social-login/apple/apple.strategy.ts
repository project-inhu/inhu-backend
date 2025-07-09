import { Injectable } from '@nestjs/common';
import { SocialAuthBaseStrategy } from '../base/social-auth-base.strategy';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';

/**
 * 애플 OAuth 인증 전략
 * - `SocialAuthBaseStrategy`를 상속하여 애플 로그인 기능을 구현함
 * - 애플 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class AppleStrategy extends SocialAuthBaseStrategy<
  AppleTokenDto,
  AppleUserInfoDto
> {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  protected authLoginUrl =
    this.configService.get<string>('APPLE_REDIRECT_URI') ?? '';

  protected socialTokenUrl =
    this.configService.get<string>('APPLE_TOKEN_URL') ?? '';

  protected getSocialTokenParams(code: string): Record<string, string> {
    return {
      client_id: this.configService.get<string>('APPLE_CLIENT_ID') ?? '',
      client_secret:
        this.configService.get<string>('APPLE_CLIENT_SECRET') ?? '',
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.configService.get<string>('APPLE_REDIRECT_URI') ?? '',
    };
  }

  public getAuthLoginUrl(): string {
    return this.authLoginUrl;
  }

  public getToken(socialToken: AppleTokenDto): string {
    return socialToken.id_token;
  }

  public extractUserInfo(userInfo: AppleUserInfoDto): SocialUserInfoDto {
    return { snsId: userInfo.sub, provider: AuthProvider.APPLE };
  }

  public async getUserInfo(token: string): Promise<AppleUserInfoDto> {
    const jwksClient = new JwksClient({
      jwksUri: this.configService.get<string>('APPLE_PUBLIC_KEY_URL') ?? '',
    });

    const decodedToken = this.jwtService.decode(token, { complete: true });

    const kid = decodedToken.header.kid;
    const signingKey = await jwksClient.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    const userInfo = verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: this.configService.get<string>('APPLE_CLIENT_ID'),
    }) as AppleUserInfoDto;

    return userInfo;
  }
}
