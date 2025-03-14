import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 모든 사용자 조회
   *
   * @author 조희주
   */
  async selectAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  /**
   * SNS ID를 기반으로 사용자 조회
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
   * UserIdx를 기반으로 사용자 조회
   *
   * @author 조희주
   */
  async selectUserByIdx(idx: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { idx, deletedAt: null },
      include: { userProvider: true },
    });
  }

  /**
   * nickname을 기반으로 사용자 조회
   *
   * @author 조희주
   */
  async selectUserByNickname(nickname: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { nickname, deletedAt: null },
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
  async insertUser(
    snsId: string,
    provider: string,
    nickname: string,
  ): Promise<User> {
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
   * 사용자 정보 수정
   *
   * @author 조희주
   */
  async updateUserByIdx(idx: number, data: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { idx, deletedAt: null },
      data,
    });
  }

  /**
   * 사용자 삭제 (soft delete)
   *
   * @author 조희주
   */
  async deleteUserByIdx(idx: number): Promise<User> {
    return await this.prisma.user.update({
      where: { idx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
