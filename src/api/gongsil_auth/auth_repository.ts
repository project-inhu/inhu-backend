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
}
