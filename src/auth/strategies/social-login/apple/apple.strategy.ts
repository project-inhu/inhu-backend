import { Injectable } from '@nestjs/common';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { SocialTokenService } from '../services/social-token.service';
import { ISocialAuthStrategy } from '../interfaces/social-auth-base.strategy';
import { Request } from 'express';
import { AUTH_PROVIDERS } from 'src/auth/common/constants/auth-provider.constant';
import { CreateUserEntity } from 'src/api/user/entity/create-user.entity';
import { UserService } from 'src/api/user/user.service';

/**
 * 애플 OAuth 인증 전략
 * - `ISocialAuthStrategy`를 구현하여 애플 로그인 기능을 구현함
 * - 애플 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class AppleStrategy
  implements
    ISocialAuthStrategy<
      'APPLE',
      AppleTokenDto,
      AppleDecodedDto,
      AppleCallbackBody
    >
{
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly socialTokenService: SocialTokenService<AppleTokenDto>,
    private readonly userService: UserService,
  ) {}

  /**
   * 애플 소셜 로그인 요청 시 필요한 파라미터를 반환
   *
   * @author 이수인
   */
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

  /**
   * 애플에서 발급한 ID 토큰을 디코딩하고 검증하여 사용자 정보를 반환
   *
   * @author 이수인
   */
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

  /**
   * 애플 소셜 로그인 제공자를 반환
   *
   * @author 이수인
   */
  private getProvider(): 'apple' {
    return AUTH_PROVIDERS['APPLE'].name;
  }

  /**
   * 애플 사용자 정보를 SocialUserInfoDto로 변환
   *
   * @author 이수인
   */
  private mapToSocialUserInfo(userInfo: AppleDecodedDto): SocialUserInfoDto {
    return { snsId: userInfo.sub, provider: this.getProvider() };
  }

  /**
   * 애플 로그인 콜백 요청에서 필요한 정보를 추출
   *
   * @author 이수인
   */
  public extractDtoFromRequest(req: Request): AppleCallbackBody {
    return req.body as AppleCallbackBody;
  }

  /**
   * 애플 로그인 URL을 반환
   *
   * @author 이수인
   */
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

  /**
   * 애플 로그인 요청을 처리하고 사용자 정보를 반환
   *
   * @author 이수인
   */
  public async login(dto: AppleCallbackBody): Promise<CreateUserEntity> {
    console.log('5. dto in apple.strategy.ts:', dto);
    console.log(
      '6. getSocialTokenParams in apple.strategy.ts:',
      this.getSocialTokenParams(dto.authorizationCode?.code ?? ''),
    );
    console.log(
      '7. APPLE_TOKEN_URL in apple.strategy.ts:',
      this.configService.get<string>('APPLE_TOKEN_URL') ?? '',
    );
    const socialToken = await this.socialTokenService.requestSocialToken(
      this.getSocialTokenParams(dto.authorizationCode?.code ?? ''),
      this.configService.get<string>('APPLE_TOKEN_URL') ?? '',
    );
    const decodedIdToken = await this.decodeIdToken(socialToken.id_token);
    const extractedUserInfo = this.mapToSocialUserInfo(decodedIdToken);
    return this.userService.createUser(extractedUserInfo);
  }
}
