import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../../api/user/user.repository';
import { generateRandomNickname } from '../../api/user/utils/random-nickname.util';
import { AuthProvider } from '../enums/auth-provider.enum';
import { SocialUserInfoDto } from '../dto/social-common/social-user-info.dto';
import { LoginTokenService } from '../services/login-token.service';
import { SocialAuthBaseStrategy } from '../strategies/base/social-auth-base.strategy';
import { KakaoStrategy } from '../strategies/kakao/kakao.strategy';
import { AccessTokenPayload } from '../interfaces/server-token/access-token-payload.interface';
import { RefreshTokenPayload } from '../interfaces/server-token/refresh-token-payload';
import { User } from '@prisma/client';
import { TokenPair } from '../interfaces/server-token/token-pair.interface';

@Injectable()
export class AuthService {
  /**
   * 소셜 로그인 제공자에 대한 매핑 정보
   * - 각 AuthProvider(enum) 값에 해당하는 로그인 전략을 저장
   *
   * @author 조희주
   */
  private readonly SOCIAL_LOGIN_MAP: Record<
    AuthProvider,
    SocialAuthBaseStrategy
  >;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly kakaoAuthService: KakaoStrategy,
    private readonly loginTokenService: LoginTokenService,
  ) {
    this.SOCIAL_LOGIN_MAP = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
    };
  }

  /**
   * 소셜 로그인 제공자 매핑
   * - 입력된 provider에 해당하는 소셜 로그인 전략을 반환
   *
   * @param provider 로그인 제공자 (AuthProvider)
   * @returns 해당 provider의 소셜 로그인 전략
   * @throws BadRequestException 지원되지 않는 provider인 경우
   *
   * @author 조희주
   */
  public getAuthService(provider: AuthProvider): SocialAuthBaseStrategy {
    const socialProviderService = this.SOCIAL_LOGIN_MAP[provider];

    if (!socialProviderService) {
      throw new BadRequestException('지원하지 않는 로그인 제공자입니다.');
    }

    return socialProviderService;
  }

  /**
   * 소셜 로그인 후 사용자 인증 (DB에서 조회 또는 신규 생성)
   * - 소셜 로그인 정보를 기반으로 사용자를 조회
   * - 기존 사용자가 없으면 새로 등록
   *
   * @param userInfo 소셜 로그인 후 받은 사용자 정보 DTO
   * @returns 기존 사용자 정보 또는 새로 등록된 사용자 정보
   *
   * @author 조희주
   */
  private async registerUser(userInfo: SocialUserInfoDto): Promise<User> {
    const snsId = userInfo.id;
    const provider = userInfo.provider;
    const nickname = generateRandomNickname();

    const existingUser = await this.userRepository.selectUserBySnsId(snsId);
    if (existingUser) {
      return existingUser;
    }

    return await this.userRepository.insertUser(snsId, nickname, provider);
  }

  /**
   * 소셜 로그인 처리
   * - 소셜 로그인 인증 코드(code)를 사용해 소셜 로그인 서비스에서 토큰을 받아옴
   * - 해당 토큰을 통해 사용자 정보를 조회 및 인증
   * - 사용자 정보가 없으면 회원 가입 후, 새 accessToken과 refreshToken을 생성
   *
   * @param provider 로그인 제공자 (AuthProvider)
   * @param code 소셜 로그인 인증 코드
   * @returns accessToken과 refreshToken 쌍
   *
   * @author 조희주
   */
  public async login(provider: AuthProvider, code: string): Promise<TokenPair> {
    const socialAuthService = this.getAuthService(provider);

    const authToken = await socialAuthService.getToken(code);
    const accessToken = socialAuthService.getAccessToken(authToken);
    const userInfo = await socialAuthService.getUserInfo(accessToken);
    const extractedUserInfo = socialAuthService.extractUserInfo(userInfo);

    const registeredUser = await this.registerUser(extractedUserInfo);

    const payload: AccessTokenPayload = { idx: registeredUser.idx };
    const jwtAccessToken =
      await this.loginTokenService.signAccessToken(payload);
    const jwtRefreshToken =
      await this.loginTokenService.signRefreshToken(payload);

    await this.userRepository.updateRefreshToken(
      registeredUser.idx,
      jwtRefreshToken,
    );

    return { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
  }

  /**
   * Refresh Token 검증 후 새로운 Access Token 발급
   * - 전달된 refreshToken의 유효성을 검증한 후 새로운 accessToken을 발급
   * - 저장된 refreshToken과 비교하여 유효하지 않으면 예외 발생
   *
   * @param userIdx 사용자 ID
   * @param refreshToken 기존의 refreshToken
   * @returns 새로운 accessToken과 refreshToken 쌍
   * @throws UnauthorizedException refreshToken이 유효하지 않거나 만료된 경우
   *
   * @author 조희주
   */
  public async regenerateToken(
    userIdx: number,
    refreshToken: string,
  ): Promise<TokenPair> {
    const storedToken = await this.userRepository.selectRefreshToken(userIdx);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 refresh token');
    }

    const payload: RefreshTokenPayload =
      await this.loginTokenService.verifyRefreshToken(refreshToken);
    if (!payload || !payload.idx) {
      throw new UnauthorizedException('잘못된 refresh token');
    }

    const newJwtAccessToken =
      await this.loginTokenService.signAccessToken(payload);
    let newJwtRefreshToken = refreshToken;

    if (storedToken !== refreshToken) {
      newJwtRefreshToken =
        await this.loginTokenService.signRefreshToken(payload);
      await this.userRepository.updateRefreshToken(userIdx, newJwtRefreshToken);
    }

    return {
      accessToken: newJwtAccessToken,
      refreshToken: newJwtRefreshToken,
    };
  }
}
