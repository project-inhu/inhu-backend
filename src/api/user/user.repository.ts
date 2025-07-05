import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { UpdateUserInput } from './input/update-user.input';
import { CreateUserInput } from './input/create-user.input';
import { UserSelectField } from './type/user-select-field';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 사용자 조회
   *
   * @author 조희주
   */
  async selectAllUsers(): Promise<UserSelectField[]> {
    return await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * SNS ID를 기반으로 사용자 조회
   *
   * @author 조희주
   */
  async selectUserBySnsId(snsId: string): Promise<UserSelectField | null> {
    return await this.prisma.user.findFirst({
      where: {
        userProvider: {
          snsId,
        },
      },
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * UserIdx를 기반으로 사용자 조회
   *
   * @author 조희주
   */
  async selectUserByUserIdx(userIdx: number): Promise<UserSelectField | null> {
    return await this.prisma.user.findUnique({
      where: { idx: userIdx, deletedAt: null },
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * nickname을 기반으로 사용자 조회
   *
   * @author 조희주
   */
  async selectUserByNickname(
    nickname: string,
  ): Promise<UserSelectField | null> {
    return await this.prisma.user.findFirst({
      where: { nickname, deletedAt: null },
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * 가장 큰 User idx 값 반환
   * 유저가 없을시 0 반환
   *
   * @author 조희주
   */
  async getMaxUserIdx(): Promise<number> {
    const maxIdxUser = await this.prisma.user.findFirst({
      orderBy: { idx: 'desc' },
      select: { idx: true },
    });

    return maxIdxUser ? maxIdxUser.idx : 0;
  }

  /**
   * user, userProvider에 새 사용자 생성
   * 임시 닉네임(N번째 인후러)을 생성하여 user에 추가
   *
   * @author 조희주
   */
  async createUser(createUserInput: CreateUserInput): Promise<UserSelectField> {
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
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * 사용자 정보 수정
   *
   * @author 조희주
   */
  async updateUserByUserIdx(
    updateUserInput: UpdateUserInput,
  ): Promise<UserSelectField> {
    const { userIdx, nickname, profileImagePath } = updateUserInput;

    return await this.prisma.user.update({
      where: { idx: userIdx, deletedAt: null },
      data: {
        nickname,
        profileImagePath,
      },
      select: {
        idx: true,
        nickname: true,
        profileImagePath: true,
        createdAt: true,
        deletedAt: true,
        userProvider: {
          select: { snsId: true, name: true },
        },
        bookmarkList: { select: { idx: true, placeIdx: true } },
        reviewList: { select: { idx: true, content: true } },
      },
    });
  }

  /**
   * 사용자 삭제 (soft delete)
   *
   * @author 조희주
   */
  async deleteUserByUserIdx(userIdx: number): Promise<void> {
    await this.prisma.user.update({
      where: { idx: userIdx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
