import { Injectable } from '@nestjs/common';
import { BlackList, User, UserProvider } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectKakaoId(kakaoId: string): Promise<UserProvider | null> {
    return await this.prisma.userProvider.findFirst({
      where: { snsId: kakaoId },
    });
  }

  async insertUser(): Promise<User> {
    return await this.prisma.user.create({
      data: {
        nickname: 'nickname',
      },
    });
  }

  async insertUserProviderByKakao(
    idx: number,
    kakaoId: string,
  ): Promise<UserProvider> {
    return await this.prisma.userProvider.create({
      data: {
        idx,
        provider: 0,
        snsId: kakaoId,
      },
    });
  }

  async updateUserRefreshTokenByIdx(
    userIdx: number,
    refreshToken: string,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { idx: userIdx },
      data: { refreshToken: refreshToken },
    });
  }

  async selectBlackListByRefreshToken(
    refreshToken: string,
  ): Promise<BlackList | null> {
    return await this.prisma.blackList.findFirst({
      where: { refreshToken: refreshToken },
    });
  }

  async selectUserByIdx(userIdx: number): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { idx: userIdx },
    });
  }

  async insertBlackList(refreshToken: string): Promise<BlackList> {
    return await this.prisma.blackList.create({
      data: { refreshToken: refreshToken },
    });
  }
}
