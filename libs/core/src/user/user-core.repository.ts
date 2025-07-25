import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_USER, SelectUser } from './model/prisma-type/select-user';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { AuthProvider } from './constants/auth-provider.constant';
import { GetAllUsersInput } from './inputs/get-user-overview.input';
import {
  SELECT_USER_FOR_ADMIN,
  SelectUserForAdmin,
} from './model/prisma-type/select-user-for-admin';

@Injectable()
export class UserCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectUserByIdx(idx: number): Promise<SelectUser | null> {
    return this.txHost.tx.user.findUnique({
      ...SELECT_USER,
      where: { idx },
    });
  }

  public async selectUserBySnsId(
    snsId: string,
    provider: AuthProvider,
  ): Promise<SelectUser | null> {
    return await this.txHost.tx.user.findFirst({
      ...SELECT_USER,
      where: {
        deletedAt: null,
        userProvider: {
          snsId,
          name: provider,
        },
      },
    });
  }

  public async selectUserAll(
    input: GetAllUsersInput,
  ): Promise<SelectUserForAdmin[]> {
    const { skip, take } = input;

    return this.txHost.tx.user.findMany({
      ...SELECT_USER_FOR_ADMIN,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
      skip,
      take,
    });
  }

  public async insertUser(input: CreateUserInput): Promise<SelectUser> {
    return this.txHost.tx.user.create({
      ...SELECT_USER,
      data: {
        nickname: input.nickname,
        profileImagePath: input.profileImagePath,
        userProvider: input.social
          ? {
              create: {
                snsId: input.social.snsId,
                name: input.social.provider,
              },
            }
          : undefined,
      },
    });
  }

  public async updateUserByIdx(
    idx: number,
    input: UpdateUserInput,
  ): Promise<void> {
    await this.txHost.tx.user.update({
      data: {
        nickname: input.nickname,
        profileImagePath: input.profileImagePath,
      },
      where: { idx, deletedAt: null },
    });
  }

  public async softDeleteUserByIdx(idx: number): Promise<void> {
    await this.txHost.tx.user.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }
}
