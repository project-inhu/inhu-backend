import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectKakaoId(kakaoId: string) {
    return await this.prisma.userProvider.findFirst({
      where: { snsId: kakaoId },
    });
  }

  async insertUser() {
    return await this.prisma.user.create({
      data: {
        nickname: 'nickname',
      },
    });
  }

  async insertUserProviderByKakao(idx: number, kakaoId: string) {
    return await this.prisma.userProvider.create({
      data: {
        idx,
        provider: 0,
        snsId: kakaoId,
      },
    });
  }
}
