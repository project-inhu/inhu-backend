import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { User } from '@prisma/client';
import { SocialUserInfoDto } from '../dto/social-common/social-user-info.dto';
import { SocialAuthBaseStrategy } from '../base/social-auth-base.strategy';
import { AuthProvider, AuthProviderIndex } from '../enum/auth-provider.enum';
import { KakaoStrategy } from '../strategies/kakao.strategy';
import { LoginTokenService } from './token.service';

@Injectable()
export class AuthService {
  /**
   * 소셜 로그인 제공자에 대한 매핑 정보
   * - 각 AuthProvider(enum) 값에 해당하는 로그인 전략을 저장
   */
  private readonly SOCIAL_LOGIN_MAP: Record<
    AuthProvider,
    SocialAuthBaseStrategy
  >;

  /**
   * 사용자 ID를 키로, 해당 사용자의 refreshToken을 저장하는 맵
   * - 단기 메모리 캐싱용으로 사용됨 (서버 재시작 시 초기화됨)
   */
  private readonly REFRESH_TOKEN_MAP: Record<number, string> = {};

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly kakaoAuthService: KakaoStrategy,
    private readonly loginTokenService: LoginTokenService,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
    };
  }

  /**
   * 소셜 로그인 사용자를 DB에서 조회하고 없으면 새로 등록
   * @param socialUserInfoDto 소셜 로그인 후 받은 사용자 정보 중 필요한 값만 추출하여 저장한 DTO
   * @returns 인증된 사용자 정보 (User 객체)
   */
  async authenticateSocialUser(
    socialUserInfoDto: SocialUserInfoDto,
  ): Promise<User> {
    const snsId = socialUserInfoDto.id;
    let user: User | null = await this.authRepository.selectUserBySnsId(snsId);

    if (!user) {
      user = await this.authRepository.insertUser(
        snsId,
        AuthProviderIndex[socialUserInfoDto.provider],
      );
    }

    return user;
  }

  /**
   * 주어진 payload를 기반으로 refreshToken을 생성
   * @param payload refreshToken에 저장될 사용자 정보
   * @returns 생성된 refreshToken (string)
   */
  async makeRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return await this.loginTokenService.signRefreshToken(payload);
  }

  /**
   * 주어진 payload를 기반으로 accessToken을 생성
   * @param payload accessToken에 저장될 사용자 정보
   * @returns 생성된 accessToken (string)
   */
  async makeAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.loginTokenService.signAccessToken(payload);
  }

  /**
   * 소셜 로그인 처리
   * - 소셜 로그인 인증 코드(code)를 사용해 소셜 로그인 서비스에서 토큰을 받아옴
   * - 해당 토큰을 통해 사용자 정보를 조회 및 인증
   * - 사용자 정보가 없으면 회원 가입 후, 새 accessToken과 refreshToken을 생성
   * @param code 소셜 로그인 인증 코드
   * @param provider 로그인 제공자
   * @returns accessToken과 refreshToken 쌍 (TokenPair)
   */
  async handleSocialLogin(
    code: string,
    provider: AuthProvider,
  ): Promise<TokenPair> {
    const socialProviderService = this.SOCIAL_LOGIN_MAP[provider];

    const authToken = await socialProviderService?.getToken(code);
    const socialUserInfo = await socialProviderService?.getUserInfo(
      socialProviderService?.getAccessToken(authToken),
    );
    const extractedUserInfo =
      socialProviderService?.extractUserInfo(socialUserInfo);
    const user = await this.authenticateSocialUser(extractedUserInfo);

    const payload = {
      idx: user.idx,
    };
    const refreshToken = await this.makeRefreshToken(payload);
    const accessToken = await this.makeAccessToken(payload);

    this.REFRESH_TOKEN_MAP[user.idx] = refreshToken;

    return { accessToken, refreshToken };
  }

  /**
   * 리프레시 토큰을 이용하여 새로운 액세스 토큰을 생성
   * - 전달된 refreshToken의 유효성을 검증한 후 새로운 accessToken을 발급
   * - 저장된 refreshToken과 비교하여 유효하지 않으면 예외 발생
   * @param refreshToken 기존의 refreshToken
   * @returns 새로운 accessToken (string)
   */
  async makeNewAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload =
      await this.loginTokenService.verifyRefreshToken(refreshToken);

    if (this.REFRESH_TOKEN_MAP[payload.idx] !== refreshToken) {
      throw new UnauthorizedException('정보가 다르네요');
    }

    return await this.makeAccessToken(payload);
  }
}
