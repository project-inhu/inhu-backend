import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokensDto, UserProviderDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { generateRandomNickname } from './utils/random-nickname.util';
import { KakaoAuthService } from './service/kakao-auth.service';
import { AuthProvider } from './enum/auth-provider.enum';
import { SocialUserInfoDto } from './dto/social-user.dto';
import { SocialAuthBaseService } from './base/social-auth-base.service';
import { providerMap } from './utils/provider-map';

// TODO : dto, interface 구분 / service 함수명 변경 / type 정의 엄격하게 / token도 token.service로 나누고 auth에서는 social+token 가져와서 기능하도록

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  public getAuthService(provider: string) {
    const providerInfo = providerMap[provider as keyof typeof providerMap];

    if (!providerInfo) {
      throw new BadRequestException('지원하지 않는 로그인 제공자입니다.');
    }

    return new providerInfo.service();
  }

  public async login(provider: string, code: string): Promise<AuthTokensDto> {
    const socialAuthService = this.getAuthService(provider);

    const authToken = await socialAuthService.getToken(code);
    const accessToken = socialAuthService.getAccessToken(authToken);
    const userInfo = await socialAuthService.getUserInfo(accessToken);
    const extractedUserInfo = socialAuthService.extractUserInfo(userInfo);
    const registeredUser = await this.registerUser(extractedUserInfo);

    const jwtAccessToken = this.generateToken(registeredUser.idx, 'access');
    const jwtRefreshToken = this.generateToken(registeredUser.idx, 'refresh');

    await this.authRepository.updateRefreshToken(
      registeredUser.idx,
      jwtRefreshToken,
    );

    return { jwtAccessToken, jwtRefreshToken };
  }

  private async registerUser(
    userInfo: SocialUserInfoDto,
  ): Promise<UserProviderDto> {
    const snsId = userInfo.id;
    const provider = userInfo.provider;
    const nickname = generateRandomNickname();

    const existingUserProvider = await this.authRepository.findUser(
      snsId,
      provider,
    );
    if (existingUserProvider) {
      return existingUserProvider;
    }

    const newUser = await this.authRepository.createUser(nickname);
    return await this.authRepository.createUserProvider(
      snsId,
      provider,
      newUser.idx,
    );
  }

  public async regenerateToken(
    userIdx: number,
    refreshToken: string,
  ): Promise<AuthTokensDto> {
    const storedToken = await this.authRepository.getRefreshToken(userIdx);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 refresh token');
    }

    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
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

    return {
      jwtAccessToken: newJwtAccessToken,
      jwtRefreshToken: newJwtRefreshToken,
    };
  }

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
