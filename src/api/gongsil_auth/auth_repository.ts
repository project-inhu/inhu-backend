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
    kakaoUserId: string,
  ): Promise<UserProvider> {
    return await this.prisma.userProvider.create({
      data: {
        idx,
        provider: 0,
        snsId: kakaoUserId,
      },
    });
  }

  async insertKakaoRefreshToken(snsId: string, kakaoRefreshToken: string) {
    const userProvider = await this.prisma.userProvider.findFirst({
      where: { snsId },
    });

    if (!userProvider) {
      throw new Error('사용자가 존재하지 않습니다.');
    }

    return await this.prisma.userProvider.update({
      where: { idx: userProvider.idx },
      data: {
        refresh_token: kakaoRefreshToken,
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
