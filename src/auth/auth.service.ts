import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User } from '@prisma/client';
import { SocialAuthFactory } from 'src/auth/factories/social-auth.factory';
import { UserPayloadInfoDto } from './dto/user-payload-info.dto';
import { tokenPairDto } from 'src/auth/dto/token-pair.interface';
import { LoginTokenService } from './login-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly socialAuthFactory: SocialAuthFactory,
    private readonly loginTokenService: LoginTokenService,
  ) {}

  private storedRefreshTokens: Record<number, string> = {};

  async socialLogin(code: string, provider: string): Promise<tokenPairDto> {
    const socialAuthService = this.socialAuthFactory.getAuthService(provider);
    const token = await socialAuthService.getToken(code);
    const socialUserInfo = await socialAuthService.getUserInfo(
      token.access_token,
    );
    const extractedUserInfo = socialAuthService.extractUserInfo(socialUserInfo);

    const user = await this.authenticateKakaoUser(extractedUserInfo);

    const accessToken = await this.loginTokenService.generateAccessToken(
      user.idx,
    );
    const refreshToken = await this.loginTokenService.generateRefreshToken(
      user.idx,
    );

    this.saveRefreshToken(user.idx, refreshToken);

    return { accessToken, refreshToken };
  }

  async authenticateKakaoUser(
    userPayloadInfoDto: UserPayloadInfoDto,
  ): Promise<User> {
    const snsId = userPayloadInfoDto.id;
    let user: User | null = await this.authRepository.selectUserBySnsId(snsId);

    if (!user) {
      user = await this.authRepository.insertUser(
        snsId,
        userPayloadInfoDto.provider,
      );
    }

    return user;
  }

  async reissueToken(serverRefreshToken: string): Promise<string> {
    const payload =
      await this.loginTokenService.verifyRefreshToken(serverRefreshToken);
    const userIdx = parseInt(payload.sub, 10);
    const storedRefreshToken = this.getStoredRefreshToken(userIdx);

    if (serverRefreshToken != storedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const newAccessToken =
      await this.loginTokenService.generateAccessToken(userIdx);

    return newAccessToken;
  }

  saveRefreshToken(idx: number, refreshToken: string): void {
    this.storedRefreshTokens[idx] = refreshToken;
  }

  getStoredRefreshToken(idx: number): string | null {
    return this.storedRefreshTokens[idx] || null;
  }
}
