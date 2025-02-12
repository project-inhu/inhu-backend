import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { SocialAuthFactory } from './factories/social-auth.factory';
import { SocialUserInfoDto } from './dto/social-common/social-user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly socialAuthFactory: SocialAuthFactory,
  ) {}

  async authenticateSocialUser(
    socialUserInfoDto: SocialUserInfoDto,
  ): Promise<UserProvider> {
    try {
      const snsId = socialUserInfoDto.id;
      let userProvider: UserProvider | null =
        await this.authRepository.selectUserProviderBySnsId(snsId);

      if (!userProvider) {
        const user = await this.authRepository.insertUser();
        userProvider = await this.authRepository.insertUserProvider(
          user.idx,
          socialUserInfoDto.provider,
          snsId,
        );
      }

      return userProvider;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException('데이터베이스 제약 조건 위반');
      } else if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('유효하지 않은 데이터 입력');
      } else {
        throw new InternalServerErrorException('Something is wrong!!');
      }
    }
  }

  async makeAccessToken(user: number): Promise<string> {
    try {
      const payload = { userIdx: user };
      return this.jwtService.sign(payload, { expiresIn: '3s' });
    } catch (error) {
      throw new UnauthorizedException('access token 발급 실패');
    }
  }

  async makeRefreshToken(user: number): Promise<string> {
    try {
      const payload = { userIdx: user };
      return this.jwtService.sign(payload, { expiresIn: '1m' });
    } catch (error) {
      throw new UnauthorizedException('refresh token 발급 실패');
    }
  }

  async handleSocialLogin(code: string, provider: string): Promise<tokenPair> {
    const socialProviderService =
      this.socialAuthFactory.getAuthService(provider);
    const authToken = await socialProviderService.getToken(code);
    const socialUserInfo = await socialProviderService.getUserInfo(
      socialProviderService.getAccessToken(authToken),
    );
    const extractedUserInfo =
      await socialProviderService.extractUserInfo(socialUserInfo);
    const user = await this.authenticateSocialUser(extractedUserInfo);

    const accessToken = await this.makeAccessToken(user.idx);
    const refreshToken = await this.makeRefreshToken(user.idx);
    await this.authRepository.updateUserRefreshTokenByIdx(
      user.idx,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  async makeNewToken(refreshToken: string): Promise<tokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('refresh 토큰 없음');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const userIdx = payload.userIdx;

      const blackList =
        await this.authRepository.selectBlackListByRefreshToken(refreshToken);
      if (blackList) {
        throw new UnauthorizedException('black list 입니다');
      }

      const user = await this.authRepository.selectUserByIdx(userIdx);

      if (user?.refreshToken !== refreshToken) {
        await this.authRepository.insertBlackList(refreshToken);
        throw new UnauthorizedException('attacker 입니다');
      }

      const newAccessToken = await this.makeAccessToken(userIdx);
      const newRefreshToken = await this.makeRefreshToken(userIdx);
      await this.authRepository.updateUserRefreshTokenByIdx(
        userIdx,
        newRefreshToken,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('재로그인하세요.');
      }
      throw new UnauthorizedException();
    }
  }
}
