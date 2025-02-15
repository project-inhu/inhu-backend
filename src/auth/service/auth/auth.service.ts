import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../../auth.repository';
import { UserProvider } from '@prisma/client';
import { SocialAuthFactory } from 'src/auth/factories/social-auth.factory';
import { UserPayloadInfoDto } from '../../dto/user-payload-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly socialAuthFactory: SocialAuthFactory,
  ) {}

  async socialLogin(code: string, provider: string) {
    const socialAuthService = this.socialAuthFactory.getAuthService(provider);
    const token = await socialAuthService.getToken(code);
    const socialUserInfo = await socialAuthService.getUserInfo(
      token.access_token,
    );
    const extractedUserInfo = socialAuthService.extractUserInfo(socialUserInfo);

    const user = await this.authenticateKakaoUser(extractedUserInfo);

    const accessToken = await this.generateAccessToken(user.idx);
    const refreshToken = await this.generateRefreshToken(user.idx);

    await this.saveKakaoRefreshToken(user.idx, refreshToken);

    return { accessToken, refreshToken };
  }

  async authenticateKakaoUser(
    userPayloadInfoDto: UserPayloadInfoDto,
  ): Promise<UserProvider> {
    const snsId = userPayloadInfoDto.id;
    let userProvider: UserProvider | null =
      await this.authRepository.selectKakaoUser(snsId);

    if (!userProvider) {
      const user = await this.authRepository.insertUser();
      userProvider = await this.authRepository.inserUserProvider(
        user.idx,
        userPayloadInfoDto.provider,
        snsId,
      );
    }

    return userProvider;
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

  async saveKakaoRefreshToken(
    idx: number,
    refreshToken: string,
  ): Promise<UserProvider | null> {
    return await this.authRepository.updateUserProviderRefreshTokenByIdx(
      idx,
      refreshToken,
    );
  }

  async reissueToken(serverRefreshToken: string): Promise<string> {
    const payload = await this.verifyRefreshToken(serverRefreshToken);
    const userIdx = parseInt(payload.sub, 10);
    const userRefreshToken = await this.getUserRefreshToken(userIdx);

    if (serverRefreshToken != userRefreshToken) {
      throw new UnauthorizedException('Attacker');
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

  async getUserRefreshToken(idx: number): Promise<string | null> {
    const user = await this.authRepository.selectUserByIdx(idx);
    const refreshToken = await this.authRepository.selectUserProviderByIdx(
      user.idx,
    );

    return refreshToken.refresh_token;
  }
}
