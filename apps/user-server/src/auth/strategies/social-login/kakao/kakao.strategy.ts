import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ISocialAuthStrategy } from '../interfaces/social-auth-base.strategy';
import axios from 'axios';
import { SocialUserInfoDto } from '@user/auth/dto/social-common/social-user-info.dto';
import { ConfigService } from '@nestjs/config';
import { SocialTokenService } from '../services/social-token.service';
import { Request } from 'express';
import { AUTH_PROVIDERS } from '@user/auth/common/constants/auth-provider.constant';
import { UserService } from '@user/api/user/user.service';
import { CreateUserEntity } from '@user/api/user/entity/create-user.entity';

/**
 * Kakao OAuth 인증 전략
 * - `ISocialAuthStrategy`를 구현하여 카카오 로그인 기능을 구현함
 * - 카카오 API를 사용하여 인증, 토큰 발급 및 사용자 정보를 가져옴
 *
 * @author 이수인
 */
@Injectable()
export class KakaoStrategy
  implements
    ISocialAuthStrategy<
      'KAKAO',
      KakaoTokenDto,
      KakaoUserInfoDto,
      KakaoCallBackQuery
    >
{
  constructor(
    private readonly configService: ConfigService,
    private readonly socialTokenService: SocialTokenService<KakaoTokenDto>,
    private readonly userService: any, // TODO: userService 타입을 정확히 지정해야 함
  ) {}

  /**
   * 카카오 소셜 로그인 요청 시 필요한 파라미터를 반환
   *
   * @author 이수인
   */
  private getSocialTokenParams(code: string): Record<string, string> {
    return {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_CLIENT_ID') ?? '',
      redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URI') ?? '',
      code: encodeURIComponent(code),
    };
  }

  /**
   * 카카오 사용자 정보를 가져오기 위한 API 호출
   *
   * @author 이수인
   */
  private async getUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    const response = await axios.get<KakaoUserInfoDto>(
      this.configService.get<string>('KAKAO_USER_INFO_URL') ?? '',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    if (!response?.data) {
      throw new UnauthorizedException('Failed to fetch information');
    }

    return response.data;
  }

  /**
   * 카카오 소셜 로그인 제공자를 반환
   *
   * @author 이수인
   */
  private getProvider(): 'kakao' {
    return AUTH_PROVIDERS['KAKAO'].name;
  }

  /**
   * 카카오 사용자 정보를 SocialUserInfoDto로 변환
   *
   * @author 이수인
   */
  private mapToSocialUserInfo(userInfo: KakaoUserInfoDto): SocialUserInfoDto {
    return { snsId: userInfo.id.toString(), provider: this.getProvider() };
  }

  /**
   * 카카오 로그인 콜백 요청에서 필요한 정보를 추출
   *
   * @author 이수인
   */
  public extractDtoFromRequest(req: Request): KakaoCallBackQuery {
    return req.query as KakaoCallBackQuery;
  }

  /**
   * 카카오 로그인 URL을 반환
   *
   * @author 이수인
   */
  public getAuthLoginUrl(): string {
    return (
      this.configService.get<string>('KAKAO_AUTH_LOGIN_URL') +
      '?response_type=code&' +
      `redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URI')}&` +
      `client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}`
    );
  }

  /**
   * 카카오 로그인 요청을 처리하고 사용자 정보를 반환
   *
   * @author 이수인
   */
  public async login(dto: KakaoCallBackQuery): Promise<CreateUserEntity> {
    const socialToken = await this.socialTokenService.requestSocialToken(
      this.getSocialTokenParams(dto.code ?? ''),
      this.configService.get<string>('KAKAO_TOKEN_URL') ?? '',
    );
    const userInfo = await this.getUserInfo(socialToken.access_token);
    const extractedUserInfo = this.mapToSocialUserInfo(userInfo);
    return this.userService.createUser(extractedUserInfo);
  }

  /**
   * 카카오 SDK를 사용하여 로그인하고 사용자 정보를 반환
   * ! 이 메서드는 카카오 SDK를 사용하여 로그인하는 경우에만 사용됨. 다른 소셜 로그인 전략에서는 사용되지 않음
   *
   * @author 이수인
   */
  public async sdkLogin(accessToken: string): Promise<CreateUserEntity> {
    const userInfo = await this.getUserInfo(accessToken);
    const extractedUserInfo = this.mapToSocialUserInfo(userInfo);
    return this.userService.createUser(extractedUserInfo);
  }
}
