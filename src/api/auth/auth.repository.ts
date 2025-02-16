import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주어진 snsId를 기반으로 해당 sns id를 가진 사용자를 조회.
   *
   * @param {string} snsId - 조회할 sns id
   * @returns {Promise<User | null>} - 해당 sns id를 가진 사용자가 있으면 User 객체 반환, 없으면 null 반환
   */
  async selectUserBySnsId(snsId: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        userProvider: {
          snsId,
        },
      },
    });
  }

  /**
   * 새로운 사용자를 생성하고, 해당 사용자와 연결된 sns provider 정보를 함께 저장.
   *
   * @param {string} snsId - 새 사용자의 sns id
   * @param {number} provider - sns provider (ex: 카카오-0, 애플-1 등)
   * @returns {Promise<User>} - 생성된 사용자 정보 반환
   */
  async insertUser(snsId: string, provider: number): Promise<User> {
    return await this.prisma.user.create({
      data: {
        nickname: 'nickname',
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
