import { Injectable } from '@nestjs/common';
import { User, UserProvider } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectKakaoUser(kakaoUserId: string): Promise<UserProvider | null> {
    return await this.prisma.userProvider.findFirst({
      where: {
        snsId: kakaoUserId,
      },
    });
  }

  async insertUser(): Promise<User> {
    return await this.prisma.user.create({
      data: {
        nickname: 'random',
      },
    });
  }

  async inserUserProvider(
    idx: number,
    provider: number,
    snsId: string,
  ): Promise<UserProvider> {
    return await this.prisma.userProvider.create({
      data: {
        idx,
        provider,
        snsId,
      },
    });
  }

  async selectUserByIdx(idx: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { idx },
    });
  }

  async updateUserProviderRefreshTokenByIdx(
    idx: number,
    refreshToken: string,
  ): Promise<UserProvider> {
    return await this.prisma.userProvider.update({
      where: { idx },
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  async selectUserProviderByIdx(idx: number): Promise<UserProvider> {
    return await this.prisma.userProvider.findFirstOrThrow({
      where: { idx },
    });
  }
}
