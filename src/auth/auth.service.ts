import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User, UserProvider } from '@prisma/client';
import { SocialAuthFactory } from 'src/auth/factories/social-auth.factory';
import { UserPayloadInfoDto } from './dto/user-payload-info.dto';
import { tokenPairDto } from 'src/auth/dto/token-pair.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly socialAuthFactory: SocialAuthFactory,
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

    const accessToken = await this.generateAccessToken(user.idx);
    const refreshToken = await this.generateRefreshToken(user.idx);

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

  async generateRefreshToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  async generateAccessToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '5s',
    });
  }

  async reissueToken(serverRefreshToken: string): Promise<string> {
    const payload = await this.verifyRefreshToken(serverRefreshToken);
    const userIdx = parseInt(payload.sub, 10);
    const storedRefreshToken = this.getStoredRefreshToken(userIdx);

    if (serverRefreshToken != storedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const newAccessToken = await this.generateAccessToken(userIdx);

    return newAccessToken;
  }

  async verifyRefreshToken(
    serverRefreshToken: string,
  ): Promise<DecodedJwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(serverRefreshToken);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  saveRefreshToken(idx: number, refreshToken: string): void {
    this.storedRefreshTokens[idx] = refreshToken;
  }

  getStoredRefreshToken(idx: number): string | null {
    return this.storedRefreshTokens[idx] || null;
  }
}
