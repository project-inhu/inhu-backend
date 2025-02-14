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

  async updateUserRefreshTokenByIdx(
    idx: number,
    refreshToken: string,
  ): Promise<UserProvider> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { idx },
    });

    return await this.prisma.userProvider.update({
      where: { idx: user.idx },
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  async getKakaoRefreshToken(snsId: string): Promise<string | null> {
    const result = await this.prisma.userProvider.findFirst({
      where: {
        snsId,
      },
      select: {
        refresh_token: true,
      },
    });

    return result?.refresh_token || null;
  }
}
