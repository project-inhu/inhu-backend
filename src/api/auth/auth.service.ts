import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokensDto, UserProviderDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { generateRandomNickname } from './utils/random-nickname.util';
import { KakaoAuthService } from './service/kakao-auth.service';
import { AuthProvider } from './enum/auth-provider.enum';
import { SocialUserInfoDto } from './dto/social-user.dto';
import { SocialAuthBaseService } from './base/social-auth-base.service';

// TODO : dto, interface 구분 / service 함수명 변경 / type 정의 엄격하게
// TODO : getAuthLoginUrl 위치 생각
@Injectable()
export class AuthService {
  private readonly providers: Partial<Record<AuthProvider, SocialAuthBaseService<any, any>>>;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {
    this.providers = {
      [AuthProvider.KAKAO]: this.kakaoAuthService,
    };
  }

  /**
   * ✅ provider에 맞는 인증 서비스 가져오기
   */
  private getAuthService(provider: AuthProvider): SocialAuthBaseService<any, any> {
    const socialAuthService = this.providers[provider];
    if (!socialAuthService) {
      throw new BadRequestException('지원하지 않는 로그인 제공자입니다.');
    }
    return socialAuthService;
  }

  /**
   * ✅ 해당 provider의 로그인 URL 가져오기
   */
  getAuthLoginUrl(provider: AuthProvider): string {
    return this.getAuthService(provider).getAuthLoginUrl();
  }

  /**
   * ✅ 소셜 로그인 진행 후 JWT 발급
   */
  async login(provider: AuthProvider, code: string): Promise<AuthTokensDto> {
    const socialAuthService = this.getAuthService(provider);

    const authToken = await socialAuthService.getToken(code);
    const accessToken = socialAuthService.getAccessToken(authToken);
    const userInfo = await socialAuthService.getUserInfo(accessToken);
    const extractedUserInfo = socialAuthService.extractUserInfo(userInfo);
    const registeredUser = await this.registerUser(extractedUserInfo);

    const jwtAccessToken = this.generateToken(registeredUser.idx, 'access');
    const jwtRefreshToken = this.generateToken(registeredUser.idx, 'refresh');

    await this.authRepository.updateRefreshToken(registeredUser.idx, jwtRefreshToken);

    return { jwtAccessToken, jwtRefreshToken };
  }

  /**
   * ✅ 소셜 로그인 사용자를 회원가입 (기존 사용자면 기존 정보 반환)
   */
  private async registerUser(userInfo: SocialUserInfoDto): Promise<UserProviderDto> {
    const snsId = userInfo.id;
    const provider = userInfo.provider;
    const nickname = generateRandomNickname();

    const existingUserProvider = await this.authRepository.findUser(snsId, provider);
    if (existingUserProvider) {
      return existingUserProvider;
    }

    const newUser = await this.authRepository.createUser(nickname);
    return await this.authRepository.createUserProvider(snsId, provider, newUser.idx);
  }

  /**
   * ✅ JWT 갱신 (Refresh Token이 유효한 경우만)
   */
  async regenerateToken(userIdx: number, refreshToken: string): Promise<AuthTokensDto> {
    const storedToken = await this.authRepository.getRefreshToken(userIdx);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 refresh token');
    }

    const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
    if (!decoded || !decoded.exp) {
      throw new UnauthorizedException('잘못된 refresh token');
    }

    const now = Math.floor(Date.now() / 1000);
    const isRefreshTokenExpired = decoded.exp < now;

    const newJwtAccessToken = this.generateToken(userIdx, 'access');
    let newJwtRefreshToken = refreshToken;

    if (isRefreshTokenExpired) {
      newJwtRefreshToken = this.generateToken(userIdx, 'refresh');
      await this.authRepository.updateRefreshToken(userIdx, newJwtRefreshToken);
    }

    return { jwtAccessToken: newJwtAccessToken, jwtRefreshToken: newJwtRefreshToken };
  }

  /**
   * ✅ JWT 토큰 생성
   */
  private generateToken(idx: number, type: 'access' | 'refresh'): string {
    return this.jwtService.sign(
      { idx },
      {
        expiresIn: type === 'access' ? '1h' : '7d',
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
