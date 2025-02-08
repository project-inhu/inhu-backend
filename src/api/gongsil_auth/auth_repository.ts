import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectKakaoUser(kakaoUserId: string) {
    return await this.prisma.userProvider.findFirst({
      where: {
        snsId: kakaoUserId,
      },
    });
  }

  async insertUser() {
    return await this.prisma.user.create({
      data: {
        nickname: 'random',
      },
    });
  }

  async inserUserProvider(idx: number, kakaoUserId: string) {
    return await this.prisma.userProvider.create({
      data: {
        idx,
        provider: 0,
        snsId: kakaoUserId,
      },
    });
  }
}
