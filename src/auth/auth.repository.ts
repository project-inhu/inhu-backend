import { Injectable } from '@nestjs/common';
import { User, UserProvider } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectUserBySnsId(snsId: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        userProvider: {
          snsId,
        },
      },
      include: {
        userProvider: true,
      },
    });
  }

  async insertUser(snsId: string, provider: number): Promise<User> {
    return await this.prisma.user.create({
      data: {
        nickname: 'random',
        userProvider: {
          create: {
            snsId,
            provider,
          },
        },
      },
    });
  }
}
