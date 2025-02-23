import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { generateTemporaryNickname } from '../utils/random-nickname.util';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * SNS ID를 기반으로 사용자 정보 조회
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
   * 현재 데이터베이스에 등록된 전체 사용자 수 반환
   *
   * @author 조희주
   */
  async getUserCount(): Promise<number> {
    return await this.prisma.user.count();
  }

  /**
   * user, userProvider에 새 사용자 생성
   * 임시 닉네임(N번째 인후러)을 생성하여 user에 추가
   *
   * @author 조희주
   */
  async insertUser(snsId: string, provider: string): Promise<User> {
    const nickname = await generateTemporaryNickname(this);
    return await this.prisma.user.create({
      data: {
        nickname,
        userProvider: {
          create: {
            snsId,
            name: provider,
          },
        },
      },
    });
  }

  /**
   * 사용자의 프로필, 닉네임 정보 조회
   *
   * @author 조희주
   */
  async selectUserProfileByUserIdx(idx: number): Promise<UserProfile> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { idx },
      select: {
        nickname: true,
        profileImagePath: true,
      },
    });
  }
}
