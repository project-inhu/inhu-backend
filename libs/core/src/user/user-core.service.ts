import { Injectable } from '@nestjs/common';
import { UserCoreRepository } from './user-core.repository';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './model/user.model';
import { AuthProvider } from './constants/auth-provider.constant';
import { UpdateUserInput } from '@libs/core/user/inputs/update-user.input';
import { GetAllUsersInput } from './inputs/get-user-overview.input';
import { UserForAdminModel } from './model/user-for-admin.model';

@Injectable()
export class UserCoreService {
  constructor(private readonly userCoreRepository: UserCoreRepository) {}

  public async getUserByIdx(idx: number): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserByIdx(idx);

    return user && UserModel.fromPrisma(user);
  }

  public async getUserBySocialId(
    snsId: string,
    provider: AuthProvider,
  ): Promise<UserModel | null> {
    const user = await this.userCoreRepository.selectUserBySnsId(
      snsId,
      provider,
    );

    return user && UserModel.fromPrisma(user);
  }

  public async getUserAll(
    input: GetAllUsersInput,
  ): Promise<UserForAdminModel[]> {
    const users = await this.userCoreRepository.selectUserAll(input);

    return users.map(UserForAdminModel.fromPrisma);
  }

  public async createUser(input: CreateUserInput): Promise<UserModel> {
    return await this.userCoreRepository
      .insertUser(input)
      .then(UserModel.fromPrisma);
  }

  public async updateUserByIdx(
    idx: number,
    input: UpdateUserInput,
  ): Promise<void> {
    return this.userCoreRepository.updateUserByIdx(idx, input);
  }

  public async deleteUserByIdx(idx: number): Promise<void> {
    return this.userCoreRepository.softDeleteUserByIdx(idx);
  }
}
