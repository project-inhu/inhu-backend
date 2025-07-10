import { BadRequestException, Injectable } from '@nestjs/common';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { SocialTokenService } from '../services/social-token.service';
import { ISocialAuthStrategy } from '../interfaces/social-auth-base.strategy';
import { Request } from 'express';

/**
 * 애플 OAuth 인증 전략
 * - `ISocialAuthStrategy`를 구현하여 애플 로그인 기능을 구현함
 * - 애플 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class AppleStrategy
  implements ISocialAuthStrategy<AppleTokenDto, AppleDecodedDto>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly socialTokenService: SocialTokenService<AppleTokenDto>,
  ) {}

  private getSocialTokenParams(code: string): Record<string, string> {
    return {
      client_id: this.configService.get<string>('APPLE_CLIENT_ID') ?? '',
      client_secret:
        this.configService.get<string>('APPLE_CLIENT_SECRET') ?? '',
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.configService.get<string>('APPLE_REDIRECT_URI') ?? '',
    };
  }

  private async decodeIdToken(idToken: string): Promise<AppleDecodedDto> {
    const jwksClient = new JwksClient({
      jwksUri: this.configService.get<string>('APPLE_PUBLIC_KEY_URL') ?? '',
    });

    const decodedToken = this.jwtService.decode(idToken, { complete: true });

    const kid = decodedToken.header.kid;
    const signingKey = await jwksClient.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    const userInfo = verify(idToken, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: this.configService.get<string>('APPLE_CLIENT_ID'),
    }) as AppleDecodedDto;

    return userInfo;
  }

  private mapToSocialUserInfo(userInfo: AppleDecodedDto): SocialUserInfoDto {
    return { snsId: userInfo.sub, provider: AuthProvider.APPLE };
  }

  public extractCodeFromRequest(req: Request): string {
    const body = req.body as AppleCallbackBody;
    const code = body.authorizationCode?.code;
    if (!code) {
      throw new BadRequestException(
        'Apple authorization code not found in request body',
      );
    }
    return code;
  }

  public getAuthLoginUrl(): string {
    return (
      this.configService.get<string>('APPLE_AUTH_LOGIN_URL') +
      `?client_id=${this.configService.get<string>('APPLE_CLIENT_ID')}&` +
      `redirect_uri=${encodeURIComponent(this.configService.get<string>('APPLE_REDIRECT_URI') ?? '')}&` +
      'response_type=code&' +
      'scope=name%20email&' +
      'response_mode=form_post&' +
      'state=a_random_csrf_token_string_12345&' +
      'nonce=another_random_string_for_nonce_67890'
    );
  }

  public async login(code: string): Promise<SocialUserInfoDto> {
    const socialToken = await this.socialTokenService.requestSocialToken(
      this.getSocialTokenParams(code),
      this.configService.get<string>('APPLE_TOKEN_URL') ?? '',
    );
    const decodedIdToken = await this.decodeIdToken(socialToken.id_token);
    return this.mapToSocialUserInfo(decodedIdToken);
  }
}
