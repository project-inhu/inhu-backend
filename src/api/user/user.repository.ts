import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { UpdateUserInput } from './input/update-user.input';
import { CreateUserInput } from './input/create-user.input';

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
  async selectUserByUserIdx(userIdx: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { idx: userIdx, deletedAt: null },
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
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { snsId, provider, nickname } = createUserInput;

    if (!nickname) {
      throw new BadRequestException('Nickname is required');
    }

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
  async updateUserByUserIdx(updateUserInput: UpdateUserInput): Promise<User> {
    const { userIdx, nickname, profileImagePath } = updateUserInput;

    return await this.prisma.user.update({
      where: { idx: userIdx, deletedAt: null },
      data: {
        nickname,
        profileImagePath,
      },
    });
  }

  /**
   * 사용자 삭제 (soft delete)
   *
   * @author 조희주
   */
  async deleteUserByUserIdx(userIdx: number): Promise<User> {
    return await this.prisma.user.update({
      where: { idx: userIdx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
