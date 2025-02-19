import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { generateRandomNickname } from '../utils/random-nickname.util';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * SNS ID를 기반으로 사용자 정보를 조회
   * - 유저가 존재하면 유저 정보를 반환
   * - 존재하지 않으면 null 반환
   *
   * @param snsId 소셜 로그인 ID
   * @returns 조회된 사용자 정보 (User | null)
   *
   * @author 조희주
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
   * 새 사용자를 생성하고, UserProvider 정보를 함께 저장
   * - 랜덤 닉네임을 생성하여 사용자 정보에 추가
   *
   * @param snsId 소셜 로그인 ID
   * @param provider 로그인 제공자 (AuthProvider)
   * @returns 생성된 사용자 정보 (User)
   *
   * @author 조희주
   */
  async insertUser(snsId: string, provider: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        nickname: generateRandomNickname(),
        userProvider: {
          create: {
            snsId,
            name: provider,
          },
        },
      },
    });
  }
}
